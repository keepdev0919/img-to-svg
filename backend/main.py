import asyncio
import io
import os
import re

import vtracer
from fastapi import FastAPI, File, Form, Request, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, Response
from PIL import Image
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address
from uvicorn.middleware.proxy_headers import ProxyHeadersMiddleware

ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:3000",
).split(",")

MAX_FILE_BYTES = 10 * 1024 * 1024  # 10MB
MAX_DIMENSION = 4096
SUPPORTED_FORMATS = {"image/png", "image/jpeg", "image/webp"}
CONVERSION_TIMEOUT = 60  # seconds

limiter = Limiter(key_func=get_remote_address)
app = FastAPI()
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Railway 프록시 뒤에서 실제 클라이언트 IP를 읽기 위해 X-Forwarded-For 신뢰
app.add_middleware(ProxyHeadersMiddleware, trusted_hosts="*")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
    expose_headers=["X-Path-Count", "X-Complexity-Warning"],
)


def load_and_validate(data: bytes, content_type: str) -> Image.Image:
    if content_type not in SUPPORTED_FORMATS:
        raise ValueError("unsupported_format")
    if len(data) > MAX_FILE_BYTES:
        raise ValueError("file_too_large")
    try:
        img = Image.open(io.BytesIO(data)).convert("RGBA")
    except Exception:
        raise ValueError("invalid_image")
    return img


def downscale_if_needed(img: Image.Image) -> Image.Image:
    w, h = img.size
    if w > MAX_DIMENSION or h > MAX_DIMENSION:
        img.thumbnail((MAX_DIMENSION, MAX_DIMENSION), Image.LANCZOS)
    return img


def remove_bg(img: Image.Image) -> Image.Image:
    try:
        from rembg import remove
        buf = io.BytesIO()
        img.save(buf, format="PNG")
        result = remove(buf.getvalue())
        return Image.open(io.BytesIO(result)).convert("RGBA")
    except Exception:
        # rembg 실패 시 조용히 원본 반환
        return img


def to_svg(img: Image.Image, color_precision: int, filter_speckle: int, path_precision: int) -> str:
    buf = io.BytesIO()
    if img.mode == "RGBA":
        # 투명 배경 유지 — remove_bg 결과를 그대로 vtracer에 전달
        img.save(buf, format="PNG")
    else:
        # RGB: 흰 배경으로 합성
        background = Image.new("RGB", img.size, (255, 255, 255))
        background.paste(img)
        background.save(buf, format="PNG")
    img_bytes = buf.getvalue()

    svg = vtracer.convert_raw_image_to_svg(
        img_bytes,
        img_format="png",
        colormode="color",
        color_precision=max(1, min(8, color_precision)),
        filter_speckle=max(1, min(100, filter_speckle)),
        path_precision=max(3, min(8, path_precision)),
    )
    return svg


def count_paths(svg: str) -> int:
    return len(re.findall(r"<path", svg))


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/api/convert")
@limiter.limit("5/minute")
async def convert(
    request: Request,
    file: UploadFile = File(...),
    color_precision: int = Form(6),
    filter_speckle: int = Form(4),
    path_precision: int = Form(3),
    remove_background: str = Form("false"),
):
    data = await file.read()
    content_type = file.content_type or ""

    # 검증
    try:
        img = load_and_validate(data, content_type)
    except ValueError as e:
        return JSONResponse(status_code=400, content={"error": str(e)})

    img = downscale_if_needed(img)

    loop = asyncio.get_running_loop()

    # 배경 제거 (CPU 집약적 — executor에서 실행)
    if remove_background.lower() == "true":
        img = await loop.run_in_executor(None, remove_bg, img)

    # 변환 (서버 측 60초 타임아웃)
    try:
        svg = await asyncio.wait_for(
            loop.run_in_executor(None, to_svg, img, color_precision, filter_speckle, path_precision),
            timeout=CONVERSION_TIMEOUT,
        )
    except asyncio.TimeoutError:
        return JSONResponse(status_code=408, content={"error": "timeout", "hint": "이미지가 너무 복잡해요. 해상도를 줄여 시도해보세요."})
    except Exception:
        return JSONResponse(status_code=500, content={"error": "conversion_failed"})

    if not svg or not svg.strip():
        return JSONResponse(status_code=500, content={"error": "conversion_failed"})

    n_paths = count_paths(svg)
    headers = {
        "X-Path-Count": str(n_paths),
        "X-Complexity-Warning": "true" if n_paths > 500 else "false",
    }

    return Response(
        content=svg,
        media_type="image/svg+xml",
        headers=headers,
    )

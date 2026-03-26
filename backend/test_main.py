import io
from unittest.mock import patch

import pytest
from fastapi.testclient import TestClient
from PIL import Image

from main import app

client = TestClient(app)


def make_png(size: tuple[int, int] = (32, 32)) -> bytes:
    buf = io.BytesIO()
    Image.new("RGB", size, (200, 100, 50)).save(buf, format="PNG")
    return buf.getvalue()


def make_webp(size: tuple[int, int] = (32, 32)) -> bytes:
    buf = io.BytesIO()
    Image.new("RGB", size, (200, 100, 50)).save(buf, format="WEBP")
    return buf.getvalue()


def make_jpeg(size: tuple[int, int] = (32, 32)) -> bytes:
    buf = io.BytesIO()
    Image.new("RGB", size, (200, 100, 50)).save(buf, format="JPEG")
    return buf.getvalue()


# ── 헬스체크 ──────────────────────────────────────────────────────────────────

def test_health():
    res = client.get("/health")
    assert res.status_code == 200
    assert res.json() == {"status": "ok"}


# ── 정상 변환 ─────────────────────────────────────────────────────────────────

def test_convert_png_returns_svg():
    res = client.post(
        "/api/convert",
        files={"file": ("test.png", make_png(), "image/png")},
    )
    assert res.status_code == 200
    assert res.headers["content-type"].startswith("image/svg+xml")
    assert "<svg" in res.text
    assert res.headers.get("X-Path-Count", "").isdigit()


def test_convert_jpeg_returns_svg():
    res = client.post(
        "/api/convert",
        files={"file": ("test.jpg", make_jpeg(), "image/jpeg")},
    )
    assert res.status_code == 200
    assert "<svg" in res.text


def test_convert_custom_params():
    res = client.post(
        "/api/convert",
        files={"file": ("test.png", make_png(), "image/png")},
        data={"color_precision": "3", "filter_speckle": "20", "path_precision": "5"},
    )
    assert res.status_code == 200
    assert "<svg" in res.text


def test_x_path_count_header():
    res = client.post(
        "/api/convert",
        files={"file": ("test.png", make_png(), "image/png")},
    )
    assert res.status_code == 200
    path_count = int(res.headers["X-Path-Count"])
    assert path_count >= 0


def test_complexity_warning_header_present():
    res = client.post(
        "/api/convert",
        files={"file": ("test.png", make_png(), "image/png")},
    )
    assert res.status_code == 200
    assert res.headers.get("X-Complexity-Warning") in ("true", "false")


# ── 입력 검증 ─────────────────────────────────────────────────────────────────

def test_unsupported_format_returns_400():
    res = client.post(
        "/api/convert",
        files={"file": ("test.gif", b"GIF89a fake data", "image/gif")},
    )
    assert res.status_code == 400
    assert res.json()["error"] == "unsupported_format"


def test_file_too_large_returns_400():
    large_data = b"x" * (11 * 1024 * 1024)  # 11MB
    res = client.post(
        "/api/convert",
        files={"file": ("large.png", large_data, "image/png")},
    )
    assert res.status_code == 400
    assert res.json()["error"] == "file_too_large"


def test_invalid_image_content_returns_400():
    res = client.post(
        "/api/convert",
        files={"file": ("fake.png", b"not actually an image", "image/png")},
    )
    assert res.status_code == 400
    assert res.json()["error"] == "invalid_image"


# ── 고해상도 자동 다운스케일 ───────────────────────────────────────────────────

def test_large_image_is_downscaled_and_converts():
    # 4097×4097 이미지 — 자동 다운스케일 후 변환
    res = client.post(
        "/api/convert",
        files={"file": ("big.png", make_png(size=(4097, 4097)), "image/png")},
    )
    assert res.status_code == 200
    assert "<svg" in res.text


# ── 파라미터 범위 클램핑 ──────────────────────────────────────────────────────

def test_out_of_range_params_are_clamped():
    # color_precision=0 → clamp to 1, path_precision=1 → clamp to 3
    res = client.post(
        "/api/convert",
        files={"file": ("test.png", make_png(), "image/png")},
        data={"color_precision": "0", "path_precision": "1"},
    )
    assert res.status_code == 200


# ── WebP 지원 ─────────────────────────────────────────────────────────────────

def test_convert_webp_returns_svg():
    res = client.post(
        "/api/convert",
        files={"file": ("test.webp", make_webp(), "image/webp")},
    )
    assert res.status_code == 200
    assert res.headers["content-type"].startswith("image/svg+xml")
    assert "<svg" in res.text


# ── 배경 제거 경로 ─────────────────────────────────────────────────────────────

def test_remove_background_true_returns_svg():
    # rembg 실제 호출 없이 경로만 검증 — remove_bg 함수를 identity로 mock
    with patch("main.remove_bg", side_effect=lambda img: img):
        res = client.post(
            "/api/convert",
            files={"file": ("test.png", make_png(), "image/png")},
            data={"remove_background": "true"},
        )
    assert res.status_code == 200
    assert "<svg" in res.text


def test_remove_background_false_skips_rembg():
    # remove_background=false 이면 remove_bg를 호출하지 않아야 함
    with patch("main.remove_bg") as mock_rembg:
        res = client.post(
            "/api/convert",
            files={"file": ("test.png", make_png(), "image/png")},
            data={"remove_background": "false"},
        )
    assert res.status_code == 200
    mock_rembg.assert_not_called()

# Stage 1: Rust 빌드 환경 (vtracer Python 바인딩 컴파일용)
FROM python:3.11-slim AS builder

RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    build-essential \
    pkg-config \
    && rm -rf /var/lib/apt/lists/*

# Rust 설치
RUN curl https://sh.rustup.rs -sSf | sh -s -- -y --default-toolchain stable
ENV PATH="/root/.cargo/bin:${PATH}"

WORKDIR /build
COPY requirements.txt .

# pip wheel 빌드 (Rust 컴파일 포함)
RUN pip install --upgrade pip && \
    pip wheel --no-cache-dir --wheel-dir /wheels -r requirements.txt

# Stage 2: 실행 환경 (Rust toolchain 제외해서 이미지 크기 최소화)
FROM python:3.11-slim AS runtime

RUN apt-get update && apt-get install -y --no-install-recommends \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# 빌드된 wheel 복사 후 설치
COPY --from=builder /wheels /wheels
RUN pip install --no-cache-dir --no-index --find-links /wheels /wheels/*.whl

# rembg U2Net 모델 사전 다운로드 (~170MB) — cold start 방지
# 첫 요청 시 다운로드 없이 바로 사용 가능
RUN python -c "\
import io; \
from PIL import Image; \
from rembg import remove; \
buf = io.BytesIO(); \
Image.new('RGB', (4, 4)).save(buf, 'PNG'); \
remove(buf.getvalue()); \
print('rembg U2Net model ready')"

COPY main.py .

ENV PORT=8000
EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

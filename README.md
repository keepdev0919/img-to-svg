# 이미지 → SVG 변환기

PNG, JPG, WebP를 Figma·PPT에서 편집 가능한 SVG로 변환하는 웹앱.

## 구조

```
image-to-svg/
├── backend/      # FastAPI + vtracer + rembg
└── frontend/     # Next.js 16 + Tailwind CSS
```

---

## 로컬 실행

### 백엔드

```bash
cd backend

# Python 가상환경
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate

# 의존성 설치 (Rust 필요: https://rustup.rs)
pip install -r requirements.txt

# 서버 실행
uvicorn main:app --reload --port 8000
```

> Rust가 없으면 vtracer 설치 실패. `curl https://sh.rustup.rs -sSf | sh` 로 설치.

### 프론트엔드

```bash
cd frontend
npm install
npm run dev
# http://localhost:3000
```

---

## 배포

### 백엔드 (Railway)

1. [railway.app](https://railway.app) 에서 새 프로젝트 생성
2. `backend/` 폴더를 GitHub에 push
3. Railway에서 해당 repo 연결 → Dockerfile 자동 감지
4. 환경변수 설정:
   - `ALLOWED_ORIGINS=https://your-app.vercel.app`
5. [UptimeRobot](https://uptimerobot.com) 에서 5분 간격 헬스체크 설정
   - URL: `https://your-backend.railway.app/health`

### 프론트엔드 (Vercel)

1. `frontend/` 폴더를 GitHub에 push
2. [vercel.com](https://vercel.com) 에서 import
3. 환경변수 설정:
   - `NEXT_PUBLIC_API_URL=https://your-backend.railway.app`

---

## API

```
POST /api/convert
Content-Type: multipart/form-data

file              이미지 파일 (PNG/JPG/WebP, 최대 10MB)
color_precision   int 1-8, 기본 6   (색상 정밀도)
filter_speckle    int 1-100, 기본 4 (노이즈 제거)
path_precision    int 3-8, 기본 3   (패스 부드러움)
remove_background "true"/"false"    (배경 제거, rembg 사용)
```

Rate limit: IP당 분당 5회

# VectorFlow — Claude Code Context

## Project

PNG/JPG/WebP 이미지를 SVG로 변환하는 웹앱.

- **Backend:** FastAPI + vtracer + rembg (`backend/`)
- **Frontend:** Next.js (App Router) + Tailwind CSS v4 (`frontend/`)
- **GitHub:** https://github.com/keepdev0919/img-to-svg

## Deploy Configuration (configured by /setup-deploy)

- Platform: Railway (backend) + Vercel (frontend)
- Production URL (backend): https://img-to-svg-production.up.railway.app
- Production URL (frontend): https://img-to-svg-six.vercel.app
- Deploy workflow: auto-deploy on push to main
- Project type: web app (monorepo — backend + frontend)
- Post-deploy health check: https://img-to-svg-production.up.railway.app/health

### Custom deploy hooks

- Pre-merge: none
- Deploy trigger: automatic on push to main (Railway watches `backend/`, Vercel watches `frontend/`)
- Deploy status: poll production URL
- Health check: https://img-to-svg-production.up.railway.app/health (HTTP 200)

### Environment variables

**Railway (backend):**
- `ALLOWED_ORIGINS=https://img-to-svg-six.vercel.app`

**Vercel (frontend):**
- `NEXT_PUBLIC_API_URL=https://img-to-svg-production.up.railway.app`
- `NEXT_PUBLIC_SITE_URL=https://img-to-svg-six.vercel.app`

## Blog Automation (보류)

매주 월요일 SEO 블로그 자동 생성을 Claude Code Remote Trigger로 시도했으나, 세션이 빈 상태로 실행되는 플랫폼 이슈로 보류 중. 상세 내용은 `docs/blog-automation.md` 참고. 플랫폼 안정화 후 재시도 예정.

## Local Development

```bash
# Backend
cd backend && python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000

# Frontend
cd frontend && npm install && npm run dev
```

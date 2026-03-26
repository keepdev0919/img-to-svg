# imgtosvg TODOs

## TODO-001: rembg 실패 시 사용자 알림

**What:** 배경 제거(`remove_background=true`) 실패 시 프론트에 알림.

**Why:** 현재 rembg가 실패하면 원본 이미지로 조용히 변환됨. 사용자는 배경이 제거된 줄 알고 SVG를 다운로드하지만 배경이 그대로임. Docker 빌드 시 U2Net 모델 다운로드가 스킵되는 경우 cold start에서 발생할 수 있음.

**How to apply:**
- 백엔드: `remove_bg()` 성공/실패 여부를 응답 헤더 `X-BG-Removed: true/false`에 추가
- 프론트: `Converter.tsx`에서 해당 헤더 읽어서 실패 시 경고 메시지 표시 ("배경 제거에 실패했어요. 원본 이미지로 변환됐습니다.")

**Effort:** CC: ~15분

---

## TODO-002: 로컬 Python 3.11 환경 구축

**What:** 백엔드 테스트(`test_main.py`)를 로컬에서 실행할 수 있도록 Python 3.11 환경 세팅.

**Why:** 시스템 Python이 3.14인데 vtracer wheel이 3.14에서 segfault 발생. Docker는 3.11을 사용하므로 로컬 테스트가 불가능한 상태.

**How to apply:**
```bash
brew install pyenv
pyenv install 3.11
cd backend && pyenv local 3.11
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt -r requirements-dev.txt
pytest test_main.py -v
```

**Effort:** 인간: ~20분 / CC: 해당없음 (환경 설정)

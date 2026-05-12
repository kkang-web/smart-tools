# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 실행 방법

빌드·서버·설치 없음. 브라우저에서 HTML 파일을 직접 열면 즉시 동작한다.

- 대시보드: `traffic_dashboard.html`
- 기타 독립 툴: `tools/lotto.html`, `tools/economy_news_infographic.html`, `tools/약속잡기.html`

인터넷 연결 필요 (Chart.js 4.4.0, chartjs-plugin-datalabels 2.2.0 CDN).

## 아키텍처

이 프로젝트는 `traffic_dashboard.html` 단일 파일이 핵심이다. 백엔드·DB 없음.

### 데이터 흐름

```
const RAW (840개 레코드, ~line 180)
        │
        ▼
  filtered() ←── let st (FILTER_STATE)
        │
        ├── KPI 카드 4개 (k1~k4)
        ├── cH: 시간대별 선형 차트
        ├── cD: 요일별 막대 차트
        ├── cR: 노선별 시간대 막대 차트
        ├── tTop5: 정체 Top5 테이블
        └── aList: 교통량 급증 경고 목록
```

- `filtered()` — `st` 상태 기반으로 RAW를 `.filter()` 하여 부분집합 반환
- `render()` — 필터 이벤트마다 호출되어 전체 UI를 재렌더링
- 차트 인스턴스(`cH`, `cD`, `cR`)는 전역 참조로 유지하고 `render()`에서 `.data` / `.update()` 방식으로 갱신

### 핵심 상수 (script 상단)

| 상수 | 내용 |
|---|---|
| `RAW` | 840개 레코드 `{date, route, hour, vol, spd}` |
| `DAYS` / `DLBL` | 7개 날짜 / 표시 레이블 |
| `ROUTES` / `RCLR` | 5개 노선명 / 차트 색상 |
| `HRS` | 0~23 시간 배열 |
| `let st` | 런타임 필터 상태 `{route, date, hMin, hMax, cong}` |

### 급증 경고 레벨

- `critical`: `ratio ≥ 1.0` (전 시간 대비 +100%)
- `warning`: `0.5 ≤ ratio < 1.0`
- `info`: `spd < st.cong` AND `vol > 3000`
- `ratio = (cur.vol - prv.vol) / prv.vol` — `prv.vol === 0`이면 제외

## UI 규칙

- 다크 모드 전용 (`#0d1117` 배경)
- 색상: 파란 `#3b82f6` (기본), 초록 `#22c55e` (원활), 빨간 `#ef4444` (혼잡), 노란 `#f59e0b` (주의·주말)
- 반응형: CSS Grid + Media Query (800px 브레이크포인트)
- 폰트: Malgun Gothic → Segoe UI fallback

## 주요 문서

- `docs/PRD.md` — 기능 명세 (필터 조건, KPI 계산식, 차트 렌더링 규칙 등 상세)
- `docs/ERD.md` — 논리적 데이터 구조 및 엔티티 관계도 (Mermaid)
- `test/` — 교통 더미 데이터 (xlsx, csv, json)
- `test/misc/` — 비관련 샘플 데이터

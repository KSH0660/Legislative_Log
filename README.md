# 입법로그 (Legislative Log)

> 누가 말했는지가 아니라, 무엇이 실제로 바뀌는지를 본다.

대한민국의 주요 법안과 정책을 원문, 데이터, 논리, 실제 결과를 기준으로
추적하는 독립적인 정책 검증 플랫폼입니다. 특정 정당이나 정치인을 지지·공격하지
않고, "그래서 실제로 무엇이 바뀌는가?"라는 질문에 집중합니다.

## 기술 스택

- [Next.js](https://nextjs.org) 15 (App Router) + TypeScript
- Tailwind CSS
- 콘텐츠는 데이터베이스 없이 `src/data/bills/*.ts`에 타입 안전한 구조로 저장됩니다.

## 개발

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
npm run lint
```

## 구조

```
src/
  app/                 라우트 (홈, 소개, 법안 목록/상세, 정정 기록)
  components/          UI 컴포넌트 (주장 배지, 비교표, 예측/결과 타임라인 등)
  data/bills/          법안·정책 콘텐츠 (타입: Bill)
  data/corrections.ts  공개 정정 기록
  lib/bills.ts         데이터 조회 헬퍼
  types/bill.ts        핵심 데이터 모델
```

## 데이터 모델의 핵심 아이디어

- **`ClaimType`**: 모든 문장은 `사실 / 공식 주장 / 해석 / 전망 / 미확인 의혹`
  중 하나로 표시됩니다. (핵심원칙 3)
- **법안 분석 10단계**: 30초 요약 → 현재 vs 변경 후 → 추진 측 주장 → 반대 측
  주장 → 실제 작동 구조 → 수혜자·비용 부담자 → 근거와 불확실성 → 입법로그
  분석 → 예측 기록 → 결과 추적. `src/types/bill.ts`의 `Bill` 타입이 이 구조를
  그대로 강제합니다.
- **예측 기록/결과 추적**: `predictions[]`에 시점·주체·전망을 그대로 남기고,
  `outcomeTracking[]`에서 6개월·1년·3년 시점마다 실제 데이터로 검증합니다.
  아직 검증할 수 없는 항목은 추측으로 채우지 않고 `추적예정` 또는
  `판단보류` 상태로 정직하게 남겨둡니다.
- **정정 기록**: `src/data/corrections.ts`에 중요한 정정 사항을 기록합니다.
  (핵심원칙 7)

새 법안·정책을 추가하려면 `src/data/bills/`에 `Bill` 타입을 따르는 파일을
만들고 `src/data/bills/index.ts`의 배열에 등록하면 됩니다.

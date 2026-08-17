---
name: add-bill
description: "입법로그에 법안·정책 기록을 추가하거나 고칠 때 쓴다. 어디에 파일을 만들지, 10단계 구조의 어느 칸에 무엇을 넣을지, category와 tags를 어떻게 정할지, 개인화 영향경로(ImpactPathway)를 어떻게 붙일지, 무엇을 돌려 검증할지를 안내한다. '법안 추가', '새 법안 등록', '법안 데이터 작성', 'add bill', '법안 갱신', '상태 변경(통과·공포·시행)', '결과 추적 갱신' 요청에 사용."
argument-hint: "[법안 이름 또는 slug]"
metadata:
  author: 입법로그
  version: "1.0.0"
---

# 법안 추가

입법로그에 법안 하나를 추가하는 일은 **파일 두 개**를 쓰고 **한 줄을 등록**하는 것이다.

```
src/data/bills/<slug>.ts     ← 본문. 10단계 구조 (필수)
src/data/bills/index.ts      ← 배열에 한 줄 등록 (필수)
src/data/impact/<slug>.ts    ← 개인화 영향경로 (필수 — 경로가 없어도 '없다'는 기록은 남긴다)
src/data/impact/index.ts     ← 배열에 한 줄 등록 (필수)
```

두 레이어는 목적이 다르다. **본문은 사람이 읽는 글**이고, **영향경로는 기계가 사용자 조건과
대조하는 구조**다. 본문만 쓰고 영향경로를 빠뜨리면 `npm run validate:impact`가 빌드를 막는다.

## 시작하기 전에 — 이 프로젝트의 원칙

`src/app/about/page.tsx`에 일곱 원칙이 있다. 데이터를 쓸 때 실제로 걸리는 것은 이 셋이다.

1. **정당이 아니라 법안을 본다.** 발의자·정당·지지 성향은 판정과 정렬에 쓰지 않는다.
2. **사실과 의견을 섞지 않는다.** 모든 문장에 `claimType`을 붙인다. 이게 이 프로젝트의 핵심이다.
3. **틀리면 공개적으로 고친다.** 고칠 때는 `src/data/corrections.ts`에 무엇을 왜 고쳤는지 남긴다.

출처 없이 사실을 지어내지 않는다. LLM이 뽑아낸 내용은 **초안일 뿐이고**, 원문·공식자료로
확인하기 전에는 공개 데이터에 넣지 않는다. 확인이 안 되면 그 항목을 비우거나
`uncertainties`에 "확인하지 못했다"고 적는다.

## 절차

### 1단계 — slug와 등록 이름 정하기

`slug`는 파일명·URL·모든 참조의 열쇠다. **영문 소문자-하이픈-연도**로 짓고 나중에 바꾸지 않는다.

```
national-pension-reform-2025
yellow-envelope-act-2025
inheritance-tax-reform-2025
```

내보내는 상수 이름은 slug의 camelCase다: `nationalPensionReform2025`.

### 2단계 — 본문 파일 작성

`assets/bill-template.ts`를 복사해서 채운다. 필드별 규칙은
**`references/bill-fields.md`를 반드시 읽고** 쓴다. 특히 `claimType`을 감으로 붙이지 않는다.

머리 부분에서 자주 틀리는 것:

- **`category`는 문자열 하나**다. 목록 화면의 `분야` 필터 칩이 이 값에서 자동으로 만들어진다
  (`getAllCategories()`). 새 값을 쓰면 칩이 하나 늘어난다. **기존 값에 맞출 수 있으면 맞춘다.**
  현재 값: `복지·연금` / `노동` / `세제` / `사법` / `정치개혁`
- **`tags`는 여러 개**이고 검색어로만 쓰인다. 필터 칩이 되지 않는다. 카드에는 3개까지 보인다.
  법 이름·쟁점·별칭처럼 **사람이 검색창에 칠 법한 말**을 넣는다.
- **`status`와 날짜는 짝이 맞아야 한다.** `공포`인데 `promulgatedDate`가 없으면 안 된다.
  시제 문구가 이 값에서 자동으로 나온다.

### 3단계 — `src/data/bills/index.ts`에 등록

```ts
import { myNewBill2026 } from "./my-new-bill-2026";

export const bills: Bill[] = [
  // ...
  myNewBill2026,
];
```

**배열 순서는 화면 순서가 아니다.** 목록은 `lastUpdated` 내림차순(비개인화)이나
관련 순서(개인화)로 다시 정렬된다. 순서 때문에 고민하지 않아도 된다.

### 4단계 — 개인화 영향경로 작성

`assets/impact-template.ts`를 복사한다. 규칙은 **`references/impact-pathways.md`에 있다.
이 문서를 읽지 않고 쓰면 검증에서 막힌다.**

가장 중요한 세 가지만 먼저:

- **경로 하나는 생활영역(`domain`) 하나만 갖는다.** 보험료(부담)와 미래 급여(혜택)는
  같은 법이어도 반드시 다른 경로다.
- **`relationship`이 `self`·`household`가 아니면 '직접 대상'이 될 수 없다.**
  "내가 사업주로서 내는 돈"(`self`)과 "내 고용주가 내는 돈이 나에게 전가되는 것"(`employer`)은
  반드시 다른 경로다.
- **개인 경로가 없는 법안도 파일을 만든다.** `pathways: []` + `review.noPersonalPathwayReason`에
  왜 없는지를 적는다. 검토를 안 한 것과 검토했더니 없는 것은 다르다.

### 5단계 — 검증

```bash
npm run validate:impact   # 개인화 데이터 규칙 (빌드를 막는다)
npm test                  # 규칙 엔진 불변식
npm run lint
npm run build             # prebuild로 validate:impact가 한 번 더 돈다
```

`validate:impact`가 내는 메시지는 규칙 번호를 달고 나온다. 번호의 뜻은
`references/impact-pathways.md`의 검증 규칙표에 있다.

### 6단계 — 눈으로 확인

```bash
npm run dev
```

- `/bills` 목록에서 카드가 보이고 `분야` 칩이 의도대로 생겼는지
- `/bills/<slug>` 상세에서 10단계가 모두 채워졌는지, 빈 섹션이 없는지
- 목록에서 `내 조건 입력하기`로 조건을 넣고, 이 법안의 관련성 판정이 말이 되는지
- `내 조건 기준 영향 지도` 탭에서 이 법안 행의 기호가 의도한 것인지

## 자주 하는 작업

### 법안 상태가 바뀌었을 때 (통과·공포·시행)

1. `status`와 해당 날짜 필드(`passedDate`/`promulgatedDate`/`effectiveDate`)를 갱신
2. `lastUpdated`를 오늘로
3. **`src/data/impact/<slug>.ts`의 `reviewedAt`과 `baselineVersion`도 함께 갱신**
   — 이걸 빠뜨리면 `validate:impact` 규칙 8이 빌드를 막는다. 의도된 동작이다.
   상태가 바뀌면 영향경로가 여전히 맞는지 실제로 다시 봐야 한다.
4. `outcomeTracking`에 확인할 시점이 왔다면 결과를 채운다

### 예측을 채점할 때

`predictions`는 **손대지 않는다.** 당시 예측을 그대로 두는 것이 이 프로젝트의 존재 이유다.
`outcomeTracking`에 `status`와 `findings`를 추가하고 `relatedPredictionIds`로 연결한다.
자료가 아직 없으면 `추적예정`이나 `판단보류`로 두고, 무엇이 없어서 판단을 미뤘는지 적는다.

### 틀린 내용을 고칠 때

`src/data/corrections.ts`에 항목을 추가한다. 무엇을 고쳤는지(`description`)와
왜 고쳤는지(`reason`)를 나눠서 적는다. 원칙 7번이다.

## 하지 말 것

- 출처 없는 수치·날짜·인용 (초안에만 두고 공개 데이터에 넣지 않는다)
- 찬성/반대 어느 쪽이 옳다는 서술 — `analysisJudgment`에 `[의견]`을 붙여 분리한다
- 약한 반대 논리를 골라 넣기 — 양쪽에서 **가장 설득력 있는** 것을 옮긴다
- 자료가 없는 것을 `확인된 직접 변화 없음`으로 처리 (그건 `판단자료 부족`이다)
- `certainty`를 개인화 레이어에 쓰기 (개인화는 `evidenceMethod`만 쓴다)
- 개인 영향을 하나의 점수·백분율로 합치기

## 참고 문서

| 파일 | 언제 읽나 |
|---|---|
| `references/bill-fields.md` | 본문 10단계의 필드별 규칙, `claimType` 고르는 법 |
| `references/impact-pathways.md` | 개인화 영향경로 작성 규칙과 검증 규칙 11가지 |
| `assets/bill-template.ts` | 본문 뼈대 — 복사해서 채운다 |
| `assets/impact-template.ts` | 영향경로 뼈대 — 복사해서 채운다 |
| `docs/personalized-bill-impact-plan.md` | 개인화 기능의 설계 근거 (§ 번호의 출처) |
| `docs/personalized-bill-impact-implementation-notes.md` | 계획서와 구현이 다른 지점 |

## 완료 체크리스트

- [ ] `src/data/bills/<slug>.ts` 10단계가 모두 채워졌다 (빈 배열 없음)
- [ ] 모든 주장에 `claimType`이 붙었고, 근거가 있는 것에는 `source`가 있다
- [ ] `category`가 기존 값과 맞거나, 새 분야를 만들 이유가 분명하다
- [ ] `status`와 날짜 필드가 서로 모순되지 않는다
- [ ] `sources`에 본문에서 쓴 출처가 모두 있다
- [ ] `src/data/bills/index.ts`에 등록했다
- [ ] `src/data/impact/<slug>.ts`를 만들고 `src/data/impact/index.ts`에 등록했다
- [ ] 경로가 없다면 `noPersonalPathwayReason`을 적었다
- [ ] 경로가 있다면 생활영역 하나당 하나로 쪼갰고 `relationship`이 정확하다
- [ ] `npm run validate:impact` 통과 (경고도 확인했다)
- [ ] `npm test`, `npm run lint`, `npm run build` 통과
- [ ] `/bills`와 `/bills/<slug>`를 브라우저에서 실제로 봤다
- [ ] 별도 검토자의 확인을 받았다

# 개인화 영향경로 작성 규칙

타입은 [`src/types/impact.ts`](../../../../src/types/impact.ts), 설계 근거는
[`docs/personalized-bill-impact-plan.md`](../../../../docs/personalized-bill-impact-plan.md)에 있다.
§ 번호는 그 문서를 가리킨다.

## 이 레이어가 하는 일

사용자가 고른 생활조건(나이·경제활동·가구·소득 등)과 법안 조항을 **기계적으로 대조**해
"왜 나와 관련 있는지 / 어느 방향으로 바뀌는지 / 무엇을 아직 모르는지"를 낸다.

본문의 `beneficiaries`/`costBearers`는 사람이 읽는 문장이라 대조할 수 없다.
그래서 같은 내용을 구조로 한 번 더 적는 것이다. 두 레이어가 서로 다른 말을 하면
`pathwayId` 링크로 잡는다.

## 파일 모양

```ts
export const myBillImpact: BillImpactData = {
  review: {
    billSlug: "my-bill-2026",
    reviewedAt: "2026-08-17",              // 오늘. 미래 날짜 금지
    baselineVersion: "…법 2026-03-24 공포 개정법률 / 2026-10-02 시행 예정 기준",
    // 경로가 하나도 없을 때만 채운다
    noPersonalPathwayReason: "…",
  },
  pathways: [ /* ImpactPathway[] */ ],
};
```

`src/data/impact/index.ts`의 `impactData` 배열에 등록한다.

## 경로를 쪼개는 기준

이게 이 레이어에서 가장 자주 틀리는 부분이다. **한 조항이 한 경로가 아니다.**

### 기준 1 — 생활영역(`domain`) 하나당 경로 하나

`domain`은 단수 필드다. 여러 영역에 걸치면 **경로를 나눈다.**
`domains: []`처럼 배열로 묶으면 한 경로의 단일 `direction`이 여러 영역에 강제 복사되어
영역별 판정이 무너진다.

```
국민연금 보험료율 인상
  → 지금 내는 보험료가 오른다        domain: social_insurance, direction: burden
  → 나중에 받을 급여가 오른다        domain: disposable_income, direction: benefit
  두 개의 다른 경로다. 순이익으로 합치지 않는다 (§8.3)
```

`ImpactDomain` 9종:

| 값 | 뜻 |
|---|---|
| `disposable_income` | 가처분소득 |
| `tax` | 세금 |
| `social_insurance` | 사회보험료 |
| `living_cost` | 생활비·주거비 |
| `employment` | 고용·임금·근로조건 |
| `service_access` | 공공서비스·지원 자격 |
| `care_education_health` | 돌봄·교육·건강 |
| `administrative_time` | 신청·행정 부담 |
| `rights_risk` | 권리·법적 보호 |

### 기준 2 — 관계 유형(`relationship`)이 다르면 다른 경로

**`self`·`household`만 `직접 대상`이 될 수 있다.** 나머지는 조건이 전부 맞아도
`간접 영향 가능`을 넘지 못한다. 이건 타입과 테스트로 강제된다(§7.3).

법이 **법적으로** 누구에게 부담을 지우는지와, 그 부담이 **경제적으로** 누구에게
가는지는 다르다. 사업주가 내는 돈은 임금·고용·가격을 통해 근로자에게 옮겨갈 수 있지만,
그게 얼마나 옮겨가는지는 별개 문제다.

```
사업주 보험료 부담 증가
  → 사용자가 사업주인 경우          relationship: "self"      → 직접 대상 가능
  → 사용자가 그 회사 근로자인 경우   relationship: "employer"  → 간접 영향 가능까지만
  반드시 다른 두 경로다.
```

| 값 | 언제 |
|---|---|
| `self` | 법이 사용자 본인에게 직접 적용 |
| `household` | 가구 단위로 적용 (상속·가구 소득 기준 급여 등) |
| `employer` | 고용주에게 적용된 것이 사용자에게 전가될 수 있음 |
| `consumer` | 기업에 적용된 것이 가격을 통해 옮겨올 수 있음 |
| `public` | 재정·제도 전반을 통한 경로 |

### 기준 3 — 시점(`timeframe`)이 다르면 대개 다른 경로

`current` / `short_term` / `long_term`. 지금의 비용과 나중의 혜택을 하나의 순이익으로
합치지 않는다. 합치려면 기대수명·임금경로·할인율 같은 가정이 더 필요하다.

단계적으로 적용되는 조항은 `appliesFrom`(`YYYY-MM-DD`)을 넣는다. 문구가 자동으로
"2026-01-01부터 적용되고 있습니다"로 나온다.

## 조건 쓰기

```ts
conditions: [
  {
    field: "economicRoles",       // ProfileKey
    operator: "includes",
    value: "employee",
    role: "required",
    explanation: "임금을 받고 일하는 직장가입자여야 합니다.",
  },
]
```

### `role` — 판정에 어떻게 걸리나

| `role` | 뜻 |
|---|---|
| `required` | 하나라도 `false`면 경로 제외. 하나라도 `unknown`이면 `조건부`로 낮아짐 |
| `excluding` | 하나라도 `true`면 경로 제외. **`unknown`이어도 `조건부`로 낮아짐** |
| `informative` | 판정은 안 바꿈. 금액 계산 입력과 설명 문구에 쓰임 |

`excluding`의 `unknown`도 판정을 낮춘다는 게 중요하다. "제외 대상인지 아직 모르는 사람"이
`직접 대상`으로 판정되면 안 되기 때문이다(§7.2 4단계).

`informative` 조건은 **금액 계산에 필요한 값**을 표시할 때 쓴다. 이게 붙어 있고
`magnitude.kind`가 계산 가능한 종류면, UI가 "금액을 계산하려면 …이 필요합니다"라고
그 질문을 따로 물어본다.

### `operator`와 질문 종류가 맞아야 한다

| `operator` | 쓰는 곳 | `value` |
|---|---|---|
| `equals` | 단일선택 질문 | `string` |
| `oneOf` | 단일선택 질문 | `string[]` (하나라도 맞으면 true) |
| `includes` | **복수선택** 질문 | `string` 또는 `string[]` (하나라도 포함되면 true) |
| `withinRange` | 구간이 있는 질문 | `{ min, max }` (`max: null` = 상한 없음) |

검증 스크립트가 이 짝을 검사한다. 복수선택 질문(`economicRoles`, `childAgeBands`,
`employmentRelation`)에 `equals`를 쓰면 실패한다.

`value`에 쓰는 범주값은 **`src/lib/profile/questions.ts`에 실제로 있는 선택지 코드**여야 한다.
없는 값을 쓰면 검증에서 막힌다.

### `withinRange`의 세 결과

사용자 구간 `U`와 조건 구간 `C`를 비교한다.

```
U ⊆ C          → true       사용자 30–39세, 조건 18–59세
U ∩ C = ∅      → false      사용자 65세 이상, 조건 18–59세
그 밖 (걸침)    → unknown    사용자 55–64세, 조건 60세 미만
```

**경계를 걸치면 `unknown`이다.** 조용히 true나 false로 떨어뜨리지 않는다.
그래서 조건 구간은 **법이 실제로 쓰는 경계**로 적는다. 밴드가 그 경계에 맞춰
설계돼 있어서, 법정 경계를 쓰면 `unknown`이 거의 안 나온다.

### `explanation`

사용자에게 그대로 보인다. "맞은 조건 ✓ / 아직 확인이 필요한 조건 ?" 목록에 뜬다.
**"…여야 합니다" 꼴의 완성된 문장**으로 쓴다. 필드 이름을 노출하지 않는다.

## `direction` 고르기

| 값 | 언제 |
|---|---|
| `benefit` | 현금 증가·부담 감소·권리 확대가 **확인됨** |
| `burden` | 세금·보험료·시간부담 증가, 권리 축소가 **확인됨** |
| `mixed` | 같은 사람에게 혜택과 부담이 함께 있음 |
| `no_direct_change` | 검토 범위 안에서 직접 변화가 없다는 **근거가 있음** |
| `unknown` | 방향을 판정할 근거가 부족함 |

**`unknown`과 `no_direct_change`를 섞지 않는다.** 자료가 없는 것은 `unknown`이다.
`no_direct_change`는 "조항 범위를 확인해 봤더니 적용 대상이 아니다"처럼 근거가 있을 때만 쓴다.
검증 규칙 5가 `no_direct_change`에 근거 2건 이상을 요구한다.

주장 주체의 표현이 아니라 **기준선 대비 작동 방식**으로 판정한다.
"경영계가 부담이라고 한다"는 `burden`의 근거가 아니다.

## `magnitude` — 금액을 낼지 말지

```ts
magnitude: { kind: "statutory_calculation", calculatorId: "nps-contribution", unit: "KRW_month" }
magnitude: { kind: "qualitative_only", eligibilityChange: "…할 수 있는 근거가 생긴다." }
```

- `statutory_calculation` — 법정 산식이 있고 **계산기가 등록돼 있을 때만.**
  `calculatorId`가 `src/lib/impact/calculators.ts`에 없으면 검증 실패
- `model_range` — 공식·대표자료 기반 추정
- `qualitative_only` — 대부분 여기. 금액을 만들지 않는다

자격·권리 변화는 단위가 없으므로 `unit`이 아니라 `eligibilityChange`에 문장으로 쓴다.

## `evidenceMethod` — 근거 방식

| 값 | 화면 표식 |
|---|---|
| `statutory_rule` | 사실 (법 조문에서 직접 확인) |
| `official_estimate` | 주장 (정부·공공기관 공식 추계) |
| `representative_model` | 해석 |
| `causal_study` | 해석 |
| `qualitative_pathway` | 해석 (제도 구조에 대한 해석) |

`ClaimType`으로 자동 변환되어 기존 `ClaimBadge`가 붙는다. 별도 `claimType` 필드는 없다.
`certainty`(높음/중간/낮음)는 **이 레이어에서 쓰지 않는다.** 확신 눈금을 두 벌 만들지 않는다.

이 값은 정렬 키이기도 하다: 법문 산식 > 공식 추계 > 대표자료 모형 > 인과연구 > 정성 경로.

## 반드시 채우는 것

| 필드 | 왜 |
|---|---|
| `baseline` | 무엇과 비교했는지 (현행 제도 서술) |
| `baselineVersion` | 기준선의 버전 식별자. 법안이 바뀌면 이 값도 바꾼다 |
| `mechanism` | 어떤 경로로 그렇게 되는지. 사용자에게 그대로 보인다 |
| `assumptions` | 이 판정이 놓은 가정. **비울 수 없다** |
| `uncertainties` | 아직 모르는 것. **비울 수 없다** |
| `legalBasis` | `Source[]`, 최소 1건. 본문의 `Source` 타입을 그대로 쓴다 |
| `reviewedAt` | 검토일. 미래 날짜 금지 |

`assumptions`와 `uncertainties`를 비우면 검증에서 막힌다. "모르는 것이 없다"는 답은
거의 언제나 틀렸다.

## 개인 경로가 없는 법안

의회 절차법, 조직 개편법처럼 개인 생활조건으로 우선순위를 정할 근거가 없는 법안이 있다.
**억지로 경로를 만들지 않는다.** `개인화할 직접 근거 없음`이 정상 결과다.

```ts
export const myBillImpact: BillImpactData = {
  review: {
    billSlug: "…",
    reviewedAt: "2026-08-17",
    baselineVersion: "…",
    noPersonalPathwayReason:
      "국회가 법안을 심사하고 표결하는 절차를 바꾸는 법입니다. 시민 모두에게 중요한 제도 " +
      "변화이지만, 연령·경제활동·가구·소득 같은 개인 생활조건으로 누가 더 관련 있는지를 " +
      "가를 조항은 없습니다.",
  },
  pathways: [],
};
```

이 문장은 카드와 상세 화면에 **그대로 보인다.** "검토를 안 했다"가 아니라
"검토했더니 없더라, 이유는 이렇다"로 읽히게 쓴다.

민감정보(수사·재판 당사자 여부, 건강, 종교 등)를 물어야만 경로가 생긴다면,
묻지 않기로 한 것이라는 사실도 함께 적는다.

## 검증 규칙 (`npm run validate:impact`)

실패하면 빌드가 멈춘다. 규칙 번호가 메시지에 나온다.

| # | 규칙 | 결과 |
|---|---|---|
| 1 | 모든 경로에 `legalBasis` 1건 이상, 각 출처에 `url` 또는 `publisher`+`date` | 실패 |
| 2 | `reviewedAt`이 있고 미래 날짜가 아님 | 실패 |
| 3 | `billSlug`가 실재하는 법안과 일치 | 실패 |
| 4 | `baselineVersion`·`baseline` 존재 | 실패 |
| 5 | `no_direct_change` 경로에 실질 근거 2건 이상 (전부 `기타` 유형이면 실패) | 실패 |
| 6 | `statutory_calculation`인데 `calculatorId`가 없거나 등록 안 됨 | 실패 |
| 7 | `field`가 `ProfileKey`에 있고, 연산자·질문 종류가 맞고, 값이 실제 선택지에 있고, `min ≤ max` | 실패 |
| 8 | 이미 일어난 상태 전이가 마지막 `reviewedAt` 이후 | 실패 |
| 9 | `bill.lastUpdated > reviewedAt` | 경고 |
| 10 | `benefit`/`burden` 경로에 대응하는 `pathwayId` 링크 없음 | 경고 |
| 11 | `employer` 경로만 있고 `self`·`household` 경로가 없음 | 경고 |
| 19 | 경로가 0건인데 `noPersonalPathwayReason`이 없음 | 실패 |
| 구조 | 경로 id 중복, `assumptions`/`uncertainties` 비어 있음, `appliesFrom` 형식 | 실패 |

**규칙 8이 뜨면 데이터를 억지로 통과시키지 말고 실제로 재검토한다.** 법안 상태가 바뀌면
영향경로가 여전히 맞는지 확인해야 한다는 뜻이지, `reviewedAt`만 오늘로 바꾸라는 뜻이 아니다.

## 다 쓴 뒤 확인

```bash
npm run validate:impact
npm test
```

그리고 브라우저에서 `/bills` → `내 조건 입력하기`로 프로필을 몇 개 넣어 보며
판정이 말이 되는지 본다. 특히:

- 이 법안의 대상이 **아닌** 프로필에서 `연결 없음`이 나오는가
- 대상인 프로필에서 이유 문장이 읽을 만한가
- `내 조건 기준 영향 지도` 탭에서 이 법안 행의 기호가 의도한 것인가

새로운 판정 조합이 생겼다면 `tests/fixtures/profiles.ts`에 골든 프로필을 추가하고
`tests/golden.test.ts`에 기대 결과를 적어 둔다.

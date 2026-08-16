/**
 * 법안 상세 페이지의 10단계 구조.
 * 본문 섹션과 목차가 같은 정의를 쓰도록 한곳에 모아 둔다.
 *
 * - `label`  화면에 표시하는 단계 번호
 * - `title`  본문 제목 (쉬운 한국어)
 * - `nav`    목차에 들어가는 짧은 이름
 * - `lede`   이 단계가 왜 있는지 한 줄 설명
 */
export interface BillSection {
  id: string;
  label: string;
  title: string;
  nav: string;
  lede?: string;
}

export const BILL_SECTIONS: BillSection[] = [
  {
    id: "summary",
    label: "01",
    title: "30초 요약",
    nav: "30초 요약",
    lede: "시간이 없다면 이 문단만 읽어도 됩니다.",
  },
  {
    id: "compare",
    label: "02",
    title: "지금과 무엇이 달라지나",
    nav: "무엇이 달라지나",
    lede: "현재 제도와 바뀐 뒤를 항목별로 나란히 놓고 비교합니다.",
  },
  {
    id: "arguments",
    label: "03 · 04",
    title: "찬성 쪽 논리와 반대 쪽 논리",
    nav: "찬반 논리",
    lede:
      "상대를 깎아내리기 좋은 약한 주장 대신, 양쪽에서 가장 설득력 있는 논리만 골라 그대로 옮깁니다.",
  },
  {
    id: "mechanism",
    label: "05",
    title: "이 정책은 실제로 어떻게 작동하나",
    nav: "작동 방식",
    lede: "법이 시행되면 무엇이 어떤 순서로 움직이는지 따라가 봅니다.",
  },
  {
    id: "stakeholders",
    label: "06",
    title: "누가 이득을 보고, 누가 부담을 지나",
    nav: "이득과 부담",
    lede: "좋은 의도가 아니라, 돈과 위험이 실제로 어디로 흐르는지 봅니다.",
  },
  {
    id: "evidence",
    label: "07",
    title: "근거는 얼마나 탄탄한가",
    nav: "근거와 한계",
    lede: "확인된 것과 아직 알 수 없는 것을 나눠서 표시합니다.",
  },
  {
    id: "analysis",
    label: "08",
    title: "입법로그의 판단",
    nav: "입법로그 판단",
    lede: "확인된 사실과 입법로그의 의견을 섞지 않고 따로 적습니다.",
  },
  {
    id: "predictions",
    label: "09",
    title: "그때 이렇게 예측했다",
    nav: "예측 기록",
    lede: "누가 언제 무엇을 장담했는지 손대지 않고 그대로 남깁니다.",
  },
  {
    id: "outcomes",
    label: "10",
    title: "그래서 실제로 어떻게 됐나",
    nav: "결과 추적",
    lede: "6개월·1년·3년 뒤 실제 데이터로 위의 예측을 다시 채점합니다.",
  },
  {
    id: "sources",
    label: "＊",
    title: "이 글이 사용한 자료",
    nav: "출처",
    lede: "직접 확인해 보실 수 있도록 근거 자료를 모두 밝힙니다.",
  },
];

export function getSection(id: string): BillSection {
  const found = BILL_SECTIONS.find((s) => s.id === id);
  if (!found) throw new Error(`알 수 없는 섹션 id: ${id}`);
  return found;
}

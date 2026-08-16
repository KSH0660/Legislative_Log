import type { Config } from "tailwindcss";

// 모든 색은 CSS 변수(globals.css)를 참조한다.
// 덕분에 클래스는 그대로 두고 라이트/다크 테마만 교체할 수 있다.
const token = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // 본문 글자
        ink: {
          DEFAULT: token("ink"),
          soft: token("ink-soft"),
          faint: token("ink-faint"),
        },
        // 배경/면
        paper: {
          DEFAULT: token("paper"),
          dim: token("paper-dim"),
          line: token("paper-line"),
          "line-soft": token("paper-line-soft"),
        },
        // 카드 등 올라온 면 (다크 모드에서 흰색 대신 사용)
        surface: {
          DEFAULT: token("surface"),
          soft: token("surface-soft"),
        },
        brand: {
          DEFAULT: token("brand"),
          strong: token("brand-strong"), // 글자로 쓸 때 (대비 확보)
          soft: token("brand-soft"), // 장식용
          wash: token("brand-wash"), // 아주 옅은 면
        },
        // 문장 표식 (사실/공식 주장/해석/전망/미확인 의혹)
        claim: {
          fact: token("claim-fact"),
          "fact-bg": token("claim-fact-bg"),
          official: token("claim-official"),
          "official-bg": token("claim-official-bg"),
          interpretation: token("claim-interpretation"),
          "interpretation-bg": token("claim-interpretation-bg"),
          forecast: token("claim-forecast"),
          "forecast-bg": token("claim-forecast-bg"),
          allegation: token("claim-allegation"),
          "allegation-bg": token("claim-allegation-bg"),
        },
        // 찬반은 가치판단을 암시하지 않도록 초록/빨강 대신 중립적인 두 색을 쓴다.
        stance: {
          pro: token("stance-pro"),
          "pro-bg": token("stance-pro-bg"),
          con: token("stance-con"),
          "con-bg": token("stance-con-bg"),
        },
        status: {
          proposed: token("status-proposed"),
          review: token("status-review"),
          pending: token("status-pending"),
          passed: token("status-passed"),
          promulgated: token("status-promulgated"),
          effective: token("status-effective"),
          discarded: token("status-discarded"),
        },
      },
      fontFamily: {
        // 웹폰트가 뜨기 전에도 한글이 제 모양으로 보이도록,
        // 한국어 시스템 글꼴을 대체 순서에 명시한다.
        serif: [
          "var(--font-serif)",
          "Apple SD Gothic Neo",
          "Noto Serif KR",
          "serif",
        ],
        sans: [
          "var(--font-sans)",
          "Pretendard",
          "Apple SD Gothic Neo",
          "Malgun Gothic",
          "system-ui",
          "sans-serif",
        ],
        mono: ["var(--font-mono)"],
      },
      maxWidth: {
        prose: "40rem", // 한글 기준 한 줄 38~42자
        content: "76rem",
      },
      lineHeight: {
        // 한글은 라틴 문자보다 글자 높이가 커서 행간을 넉넉히 준다.
        ko: "1.85",
        "ko-tight": "1.65",
      },
      fontSize: {
        // 화면 폭에 따라 매끄럽게 자라는 제목 단계.
        // 단계마다 clamp를 써서 375px과 1440px 사이에 끊김이 없다.
        display: ["clamp(1.9rem, 1.2rem + 3vw, 3.5rem)", { lineHeight: "1.18" }],
        title: ["clamp(1.6rem, 1.2rem + 1.7vw, 2.35rem)", { lineHeight: "1.25" }],
        heading: ["clamp(1.35rem, 1.15rem + 0.85vw, 1.75rem)", { lineHeight: "1.35" }],
      },
      boxShadow: {
        card: "0 1px 2px rgb(var(--shadow) / var(--shadow-b)), 0 1px 3px -1px rgb(var(--shadow) / var(--shadow-a))",
        lift: "0 8px 20px -6px rgb(var(--shadow) / var(--shadow-a)), 0 2px 6px -2px rgb(var(--shadow) / var(--shadow-b))",
        // 헤더가 본문 위로 떠 있을 때만 켜는 아주 얕은 그림자
        float: "0 1px 0 0 rgb(var(--paper-line) / 0.7), 0 6px 16px -10px rgb(var(--shadow) / var(--shadow-a))",
      },
      transitionTimingFunction: {
        out: "cubic-bezier(0.22, 1, 0.36, 1)",
        "in-out": "cubic-bezier(0.65, 0, 0.35, 1)",
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(6px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        // 목차를 펼칠 때 높이를 밀지 않고 안쪽에서 열리게 한다.
        "slide-down": {
          from: { opacity: "0", transform: "translateY(-4px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.3s cubic-bezier(0.22, 1, 0.36, 1) both",
        "fade-in": "fade-in 0.2s ease-out both",
        "slide-down": "slide-down 0.18s cubic-bezier(0.22, 1, 0.36, 1) both",
      },
    },
  },
  plugins: [],
};

export default config;

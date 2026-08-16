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
        serif: ["var(--font-serif)", "serif"],
        sans: ["var(--font-sans)", "sans-serif"],
      },
      maxWidth: {
        prose: "42rem", // 한글 기준 한 줄 40자 안팎
        content: "72rem",
      },
      lineHeight: {
        // 한글은 라틴 문자보다 글자 높이가 커서 행간을 넉넉히 준다.
        ko: "1.85",
        "ko-tight": "1.65",
      },
      boxShadow: {
        card: "0 1px 2px rgb(var(--shadow) / 0.05), 0 1px 3px rgb(var(--shadow) / 0.04)",
        lift: "0 4px 12px rgb(var(--shadow) / 0.08), 0 2px 4px rgb(var(--shadow) / 0.04)",
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(4px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.25s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;

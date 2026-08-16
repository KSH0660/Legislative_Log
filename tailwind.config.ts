import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#181A1F",
          soft: "#3F4250",
          faint: "#6B6E7B",
        },
        paper: {
          DEFAULT: "#FAF9F4",
          dim: "#F1EEE4",
          line: "#E3DFD1",
        },
        brand: {
          DEFAULT: "#8A5A22",
          dark: "#6B4419",
          light: "#B7863F",
        },
        claim: {
          fact: "#1C6E4A",
          "fact-bg": "#E7F2EB",
          official: "#3A4A63",
          "official-bg": "#EAEEF4",
          interpretation: "#6B3F94",
          "interpretation-bg": "#F1EAF6",
          forecast: "#A15C13",
          "forecast-bg": "#FBEEDE",
          allegation: "#A32B3A",
          "allegation-bg": "#FAEAEC",
        },
        status: {
          proposed: "#6B6E7B",
          review: "#A15C13",
          pending: "#6B3F94",
          passed: "#1C6E4A",
          promulgated: "#1C6E4A",
          effective: "#8A5A22",
          discarded: "#A32B3A",
        },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "serif"],
        sans: ["var(--font-sans)", "sans-serif"],
      },
      maxWidth: {
        prose: "42rem",
        content: "72rem",
      },
    },
  },
  plugins: [],
};

export default config;

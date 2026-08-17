import type { Metadata, Viewport } from "next";
import { Noto_Sans_KR, Noto_Serif_KR } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { PersonalizationProvider } from "@/components/personalize/PersonalizationProvider";
import "./globals.css";

const notoSans = Noto_Sans_KR({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const notoSerif = Noto_Serif_KR({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

const siteUrl = "https://ksh0660.github.io/Legislative_Log";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "입법로그 — 말이 아니라, 결과까지",
    template: "%s | 입법로그",
  },
  description:
    "누가 말했는지가 아니라, 무엇이 실제로 바뀌는지를 봅니다. 입법로그는 국회를 통과하는 법과 정책을 원문·데이터·실제 결과로 검증해 기록하는 곳입니다.",
  keywords: [
    "입법로그",
    "법안 분석",
    "정책 검증",
    "국회",
    "팩트체크",
    "정책 추적",
  ],
  openGraph: {
    title: "입법로그 — 말이 아니라, 결과까지",
    description: "누가 말했는지가 아니라, 무엇이 실제로 바뀌는지를 봅니다.",
    url: siteUrl,
    siteName: "입법로그",
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "입법로그 — 말이 아니라, 결과까지",
    description: "누가 말했는지가 아니라, 무엇이 실제로 바뀌는지를 봅니다.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  // globals.css의 --paper 값과 같아야 주소창과 화면 배경이 이어져 보인다.
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAF9F4" },
    { media: "(prefers-color-scheme: dark)", color: "#111217" },
  ],
};

// 화면이 그려지기 전에 테마를 적용해 깜빡임(FOUC)을 막는다.
const THEME_INIT = `(function(){try{var s=localStorage.getItem("theme");var d=s?s==="dark":window.matchMedia("(prefers-color-scheme: dark)").matches;document.documentElement.classList.toggle("dark",d);}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT }} />
      </head>
      <body
        className={`${notoSans.variable} ${notoSerif.variable} font-sans flex min-h-screen flex-col`}
      >
        <a
          href="#main"
          className="sr-only-focusable absolute left-4 top-4 z-50 rounded-lg bg-ink px-4 py-2.5 text-sm font-semibold text-paper shadow-lift"
        >
          본문 바로가기
        </a>
        {/* 개인화 상태는 목록과 상세가 함께 쓰므로 최상위에 둔다.
            첫 페인트는 언제나 비개인화 상태이며, 복원은 useEffect에서만 한다. (§13.2) */}
        <PersonalizationProvider>
          <Header />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
        </PersonalizationProvider>
      </body>
    </html>
  );
}

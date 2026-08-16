import type { Metadata } from "next";
import { Noto_Sans_KR, Noto_Serif_KR } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

const notoSans = Noto_Sans_KR({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

const notoSerif = Noto_Serif_KR({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["500", "600", "700", "900"],
  display: "swap",
});

const siteUrl = "https://legislative-log.example";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "입법로그 — 말이 아니라, 결과까지",
    template: "%s | 입법로그",
  },
  description:
    "누가 말했는지가 아니라, 무엇이 실제로 바뀌는지를 본다. 입법로그는 대한민국의 주요 법안과 정책을 원문, 데이터, 논리, 실제 결과를 기준으로 추적하는 독립적인 정책 검증 플랫폼입니다.",
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
    description: "누가 말했는지가 아니라, 무엇이 실제로 바뀌는지를 본다.",
    url: siteUrl,
    siteName: "입법로그",
    locale: "ko_KR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${notoSans.variable} ${notoSerif.variable} font-sans flex min-h-screen flex-col`}
      >
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

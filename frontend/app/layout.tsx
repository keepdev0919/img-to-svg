import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://vectorflow.app";

export const metadata: Metadata = {
  title: "이미지 SVG 변환기 | VectorFlow — PNG·JPG·WebP 무료 변환",
  description:
    "PNG, JPG, WebP 이미지를 Figma·PPT에서 편집 가능한 SVG로 무료 변환. 배경 제거 기능 포함. 회원가입 없이 즉시 사용.",
  keywords: [
    "이미지 SVG 변환",
    "PNG SVG 변환",
    "JPG SVG 변환",
    "image to svg",
    "svg converter",
    "벡터 변환",
    "배경 제거",
  ],
  openGraph: {
    title: "이미지 SVG 변환기 | VectorFlow",
    description: "PNG, JPG, WebP를 Figma·PPT에서 편집 가능한 SVG로 무료 변환. 배경 제거 포함.",
    url: siteUrl,
    siteName: "VectorFlow",
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "이미지 SVG 변환기 | VectorFlow",
    description: "PNG, JPG, WebP를 Figma·PPT에서 편집 가능한 SVG로 무료 변환.",
  },
  alternates: {
    canonical: siteUrl,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${plusJakartaSans.variable} ${inter.variable}`}>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import "../globals.css";

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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://img-to-svg-six.vercel.app";

export const metadata: Metadata = {
  title: "Image to SVG Converter | imgtosvg — PNG·JPG·WebP Free Converter",
  description:
    "Convert PNG, JPG, WebP images to editable SVG for Figma & PowerPoint. Background removal included. Free, no sign-up required.",
  keywords: [
    "이미지 SVG 변환", "PNG SVG 변환", "JPG SVG 변환",
    "image to svg", "imgtosvg", "svg converter", "벡터 변환", "배경 제거",
  ],
  openGraph: {
    title: "Image to SVG Converter | imgtosvg",
    description: "Convert PNG, JPG, WebP to editable SVG for Figma & PowerPoint. Free.",
    url: siteUrl,
    siteName: "imgtosvg",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Image to SVG Converter | imgtosvg",
    description: "Convert PNG, JPG, WebP to editable SVG. Free.",
  },
  alternates: {
    canonical: siteUrl,
    languages: {
      "ko": siteUrl,
      "en": `${siteUrl}/en`,
    },
  },
  robots: { index: true, follow: true },
};

interface Props {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${plusJakartaSans.variable} ${inter.variable}`}>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-14CF8FYHQZ" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-14CF8FYHQZ');
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

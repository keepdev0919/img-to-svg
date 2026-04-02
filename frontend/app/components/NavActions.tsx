"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LanguageSwitcher } from "./LanguageSwitcher";

declare const gtag: (...args: unknown[]) => void;

function track(label: string) {
  if (typeof gtag !== "undefined") {
    gtag("event", label, { event_category: "nav" });
  }
}

export function NavLinks() {
  const t = useTranslations("Nav");
  return (
    <div className="hidden md:flex items-center gap-10">
      <a href="#" onClick={() => track("convert")} className="text-[#383fd9] font-bold border-b-2 border-[#383fd9] pb-1 font-headline text-sm tracking-tight">
        {t("convert")}
      </a>
      <a href="#" onClick={() => track("pricing")} className="text-[#1b1b24]/60 hover:text-[#383fd9] font-medium font-headline text-sm tracking-tight transition-colors">
        {t("pricing")}
      </a>
      <a href="#" onClick={() => track("api")} className="text-[#1b1b24]/60 hover:text-[#383fd9] font-medium font-headline text-sm tracking-tight transition-colors">
        {t("api")}
      </a>
      <Link href="/blog" onClick={() => track("blog")} className="text-[#1b1b24]/60 hover:text-[#383fd9] font-medium font-headline text-sm tracking-tight transition-colors">
        {t("blog")}
      </Link>
    </div>
  );
}

export function NavButtons() {
  const t = useTranslations("Nav");
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <div className="flex items-center gap-2">
        <LanguageSwitcher />
        <button onClick={() => track("login")} className="hidden md:block px-6 py-2.5 text-sm font-medium text-[#1b1b24]/80 hover:text-[#383fd9] transition-colors">
          {t("login")}
        </button>
        <button onClick={() => track("signup")} className="hidden md:block px-6 py-2.5 bg-gradient-to-br from-[#383fd9] to-[#535bf2] text-white text-sm font-semibold rounded-full editorial-shadow hover:opacity-90 active:scale-95 transition-all">
          {t("signUp")}
        </button>
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="md:hidden p-2 text-[#1b1b24]/70 hover:text-[#383fd9] transition-colors"
          aria-label="메뉴 열기"
        >
          <span className="material-symbols-outlined text-2xl">{mobileOpen ? "close" : "menu"}</span>
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden fixed inset-x-0 top-20 bg-white border-b border-[#c6c5d8]/30 shadow-lg z-50 px-6 py-4 flex flex-col gap-1">
          <a href="#" onClick={() => { track("convert"); setMobileOpen(false); }} className="py-3 text-sm font-medium text-[#383fd9] border-b border-[#f0eeff]">
            {t("convert")}
          </a>
          <a href="#" onClick={() => { track("pricing"); setMobileOpen(false); }} className="py-3 text-sm font-medium text-[#1b1b24]/70 border-b border-[#f0eeff]">
            {t("pricing")}
          </a>
          <a href="#" onClick={() => { track("api"); setMobileOpen(false); }} className="py-3 text-sm font-medium text-[#1b1b24]/70 border-b border-[#f0eeff]">
            {t("api")}
          </a>
          <Link href="/blog" onClick={() => { track("blog"); setMobileOpen(false); }} className="py-3 text-sm font-medium text-[#1b1b24]/70 border-b border-[#f0eeff]">
            {t("blog")}
          </Link>
          <div className="flex gap-2 pt-2">
            <button onClick={() => { track("login"); setMobileOpen(false); }} className="flex-1 py-2.5 text-sm font-medium text-[#1b1b24]/80 border border-[#c6c5d8] rounded-full hover:border-[#383fd9] transition-colors">
              {t("login")}
            </button>
            <button onClick={() => { track("signup"); setMobileOpen(false); }} className="flex-1 py-2.5 bg-gradient-to-br from-[#383fd9] to-[#535bf2] text-white text-sm font-semibold rounded-full hover:opacity-90 transition-all">
              {t("signUp")}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

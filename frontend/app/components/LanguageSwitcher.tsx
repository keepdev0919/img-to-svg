"use client";

import { useState, useRef, useEffect } from "react";
import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";

const LANGUAGES = [
  { code: "ko", label: "한국어", flag: "🇰🇷" },
  { code: "en", label: "English", flag: "🇺🇸" },
];

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const switchLocale = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-[#1b1b24]/70 hover:text-[#383fd9] transition-colors rounded-lg hover:bg-[#383fd9]/5"
        aria-label="Language selector"
      >
        <span className="material-symbols-outlined text-[18px]">language</span>
        <span className="hidden sm:inline">{LANGUAGES.find((l) => l.code === locale)?.label}</span>
        <span className="material-symbols-outlined text-[14px] opacity-60">expand_more</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl border border-[#c6c5d8]/40 shadow-lg overflow-hidden z-50">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => switchLocale(lang.code)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-[#f5f2ff] ${
                locale === lang.code
                  ? "text-[#383fd9] font-semibold bg-[#f5f2ff]"
                  : "text-[#1b1b24]"
              }`}
            >
              <span>{lang.flag}</span>
              <span>{lang.label}</span>
              {locale === lang.code && (
                <span className="material-symbols-outlined text-[16px] ml-auto">check</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

declare const gtag: (...args: unknown[]) => void;

function track(label: string) {
  if (typeof gtag !== "undefined") {
    gtag("event", "click", { event_category: "nav", event_label: label });
  }
}

export function NavLinks() {
  return (
    <div className="hidden md:flex items-center gap-10">
      <a href="#" onClick={() => track("convert")} className="text-[#383fd9] font-bold border-b-2 border-[#383fd9] pb-1 font-headline text-sm tracking-tight">
        Convert
      </a>
      <a href="#" onClick={() => track("pricing")} className="text-[#1b1b24]/60 hover:text-[#383fd9] font-medium font-headline text-sm tracking-tight transition-colors">
        Pricing
      </a>
      <a href="#" onClick={() => track("api")} className="text-[#1b1b24]/60 hover:text-[#383fd9] font-medium font-headline text-sm tracking-tight transition-colors">
        API
      </a>
      <a href="/blog" onClick={() => track("blog")} className="text-[#1b1b24]/60 hover:text-[#383fd9] font-medium font-headline text-sm tracking-tight transition-colors">
        Blog
      </a>
    </div>
  );
}

export function NavButtons() {
  return (
    <div className="flex items-center gap-4">
      <button onClick={() => track("login")} className="px-6 py-2.5 text-sm font-medium text-[#1b1b24]/80 hover:text-[#383fd9] transition-colors">
        Login
      </button>
      <button onClick={() => track("signup")} className="px-6 py-2.5 bg-gradient-to-br from-[#383fd9] to-[#535bf2] text-white text-sm font-semibold rounded-full editorial-shadow hover:opacity-90 active:scale-95 transition-all">
        Sign Up
      </button>
    </div>
  );
}

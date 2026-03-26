import Converter from "./components/Converter";
import { NavLinks, NavButtons } from "./components/NavActions";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "imgtosvg",
  alternateName: "이미지 SVG 변환기",
  description:
    "PNG, JPG, WebP 이미지를 Figma·PPT에서 편집 가능한 SVG 파일로 무료 변환하는 온라인 도구",
  applicationCategory: "DesignApplication",
  operatingSystem: "Web",
  inLanguage: "ko",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "KRW",
  },
  featureList: [
    "PNG to SVG conversion",
    "JPG to SVG conversion",
    "WebP to SVG conversion",
    "Background removal",
    "Color precision control",
  ],
};

export default function Home() {
  return (
    <div className="min-h-screen bg-[#fbf8ff] text-[#1b1b24] selection:bg-[#383fd9]/20 selection:text-[#383fd9]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass-nav border-b border-[#c6c5d8]/30">
        <div className="flex justify-between items-center px-8 h-20 w-full max-w-7xl mx-auto">
          <div className="text-2xl font-bold tracking-tighter font-headline">imgtosvg</div>
          <NavLinks />
          <NavButtons />
        </div>
      </nav>

      {/* Main */}
      <main className="pt-32 pb-24 px-6 max-w-7xl mx-auto">

        {/* Hero */}
        <header className="text-center mb-16 space-y-4">
          <h1 className="text-5xl md:text-7xl font-extrabold font-headline tracking-tight">
            이미지를 SVG로{" "}
            <span className="text-[#383fd9]">무료 변환</span>
          </h1>
          <p className="text-lg md:text-xl text-[#454555] font-medium max-w-2xl mx-auto leading-relaxed">
            PNG, JPG, WebP를 Figma·PPT에서 편집 가능한 SVG로 즉시 변환하세요.{" "}
            <br className="hidden md:block" />
            배경 제거 기능 포함. 완전 무료.
          </p>
        </header>

        {/* Interactive converter (client component) */}
        <Converter />

        {/* Features bento grid */}
        <section aria-label="주요 기능" className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 bg-[#f5f2ff] rounded-3xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center editorial-shadow">
              <span className="material-symbols-outlined text-[#383fd9]">bolt</span>
            </div>
            <h2 className="text-xl font-bold font-headline">초고속 변환</h2>
            <p className="text-[#454555] text-sm leading-relaxed">
              자체 엔진을 통해 고해상도 이미지도 단 몇 초 만에 정밀한 SVG로 변환합니다.
            </p>
          </div>
          <div className="p-8 bg-[#f5f2ff] rounded-3xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center editorial-shadow">
              <span className="material-symbols-outlined text-[#383fd9]">precision_manufacturing</span>
            </div>
            <h2 className="text-xl font-bold font-headline">정교한 벡터 패스</h2>
            <p className="text-[#454555] text-sm leading-relaxed">
              AI가 형태의 곡선을 분석하여 불필요한 노드를 최소화한 깔끔한 패스를 생성합니다.
            </p>
          </div>
          <div className="p-8 bg-[#f5f2ff] rounded-3xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center editorial-shadow">
              <span className="material-symbols-outlined text-[#383fd9]">security</span>
            </div>
            <h2 className="text-xl font-bold font-headline">개인정보 보호</h2>
            <p className="text-[#454555] text-sm leading-relaxed">
              업로드된 모든 파일은 변환 완료 후 즉시 서버에서 삭제되어 안전하게 보호됩니다.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-12 px-8 bg-[#f5f2ff] border-t border-[#1b1b24]/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col gap-2">
            <span className="text-xl font-bold font-headline">imgtosvg</span>
            <p className="text-xs text-[#1b1b24]/50">© 2025 imgtosvg. All rights reserved.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-8">
            <a href="#" className="text-xs text-[#1b1b24]/50 hover:text-[#1b1b24] transition-colors">Terms of Service</a>
            <a href="#" className="text-xs text-[#1b1b24]/50 hover:text-[#1b1b24] transition-colors">Privacy Policy</a>
            <a href="#" className="text-xs text-[#1b1b24]/50 hover:text-[#1b1b24] transition-colors">Help Center</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

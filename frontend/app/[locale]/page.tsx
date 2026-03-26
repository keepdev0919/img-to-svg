import { getTranslations } from "next-intl/server";
import Converter from "../components/Converter";
import { NavLinks, NavButtons } from "../components/NavActions";

export default async function Home() {
  const t = await getTranslations("Home");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "imgtosvg",
    alternateName: "Image to SVG Converter",
    description: "Convert PNG, JPG, WebP images to editable SVG for Figma & PowerPoint. Free.",
    applicationCategory: "DesignApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    featureList: [
      "PNG to SVG conversion",
      "JPG to SVG conversion",
      "WebP to SVG conversion",
      "Background removal",
      "Color precision control",
    ],
  };

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
            {t("heroTitle")}{" "}
            <span className="text-[#383fd9]">{t("heroHighlight")}</span>
          </h1>
          <p className="text-lg md:text-xl text-[#454555] font-medium max-w-2xl mx-auto leading-relaxed">
            {t("heroSubtitle")}
          </p>
        </header>

        {/* Converter */}
        <Converter />

        {/* Features */}
        <section aria-label={t("featuresLabel")} className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 bg-[#f5f2ff] rounded-3xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center editorial-shadow">
              <span className="material-symbols-outlined text-[#383fd9]">bolt</span>
            </div>
            <h2 className="text-xl font-bold font-headline">{t("features.speed.title")}</h2>
            <p className="text-[#454555] text-sm leading-relaxed">{t("features.speed.desc")}</p>
          </div>
          <div className="p-8 bg-[#f5f2ff] rounded-3xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center editorial-shadow">
              <span className="material-symbols-outlined text-[#383fd9]">precision_manufacturing</span>
            </div>
            <h2 className="text-xl font-bold font-headline">{t("features.precision.title")}</h2>
            <p className="text-[#454555] text-sm leading-relaxed">{t("features.precision.desc")}</p>
          </div>
          <div className="p-8 bg-[#f5f2ff] rounded-3xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center editorial-shadow">
              <span className="material-symbols-outlined text-[#383fd9]">security</span>
            </div>
            <h2 className="text-xl font-bold font-headline">{t("features.privacy.title")}</h2>
            <p className="text-[#454555] text-sm leading-relaxed">{t("features.privacy.desc")}</p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-12 px-8 bg-[#f5f2ff] border-t border-[#1b1b24]/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col gap-2">
            <span className="text-xl font-bold font-headline">imgtosvg</span>
            <p className="text-xs text-[#1b1b24]/50">{t("footer.copyright")}</p>
          </div>
          <div className="flex flex-wrap justify-center gap-8">
            <a href="#" className="text-xs text-[#1b1b24]/50 hover:text-[#1b1b24] transition-colors">{t("footer.terms")}</a>
            <a href="#" className="text-xs text-[#1b1b24]/50 hover:text-[#1b1b24] transition-colors">{t("footer.privacy")}</a>
            <a href="#" className="text-xs text-[#1b1b24]/50 hover:text-[#1b1b24] transition-colors">{t("footer.help")}</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

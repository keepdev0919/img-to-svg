import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getAllPosts } from "@/app/blog/lib/posts";

export const metadata: Metadata = {
  title: "Blog | imgtosvg — SVG Conversion Tips & Guides",
  description:
    "Tips on converting PNG, JPG, WebP to SVG, Figma workflows, and design guides.",
};

export default async function BlogIndex() {
  const posts = getAllPosts();
  const t = await getTranslations("Blog");

  return (
    <main className="max-w-4xl mx-auto px-4 py-16">
      <div className="mb-12">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-[#1b1b24]/50 hover:text-[#383fd9] transition-colors mb-8"
        >
          {t("backToConverter")}
        </Link>
        <h1 className="text-4xl font-bold mt-6 mb-3 text-[#1b1b24] font-headline">{t("title")}</h1>
        <p className="text-[#1b1b24]/60">{t("subtitle")}</p>
      </div>

      {posts.length === 0 ? (
        <p className="text-[#1b1b24]/40">{t("empty")}</p>
      ) : (
        <ul className="grid gap-5">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/blog/${post.slug}`}
                className="group block p-6 bg-white rounded-2xl border border-[#c6c5d8]/50 hover:border-[#383fd9]/40 hover:shadow-[0_8px_32px_rgba(56,63,217,0.08)] transition-all"
              >
                <div className="flex items-center gap-2 mb-3">
                  <time className="text-xs text-[#1b1b24]/40">{post.date}</time>
                  <span className="text-[#1b1b24]/20">·</span>
                  <span className="text-xs text-[#1b1b24]/40">{t("minRead", { n: post.readingTime })}</span>
                </div>
                <h2 className="text-xl font-semibold mb-2 text-[#1b1b24] group-hover:text-[#383fd9] transition-colors font-headline leading-snug">
                  {post.title}
                </h2>
                <p className="text-[#1b1b24]/60 text-sm leading-relaxed line-clamp-2">
                  {post.description}
                </p>
                <span className="inline-flex items-center gap-1 mt-4 text-sm font-medium text-[#383fd9]">
                  {t("readMore")}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

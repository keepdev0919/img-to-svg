import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "./lib/posts";

export const metadata: Metadata = {
  title: "블로그 | imgtosvg — SVG 변환 팁 & 가이드",
  description:
    "PNG, JPG, WebP를 SVG로 변환하는 방법, 피그마 활용 팁, 디자인 워크플로우 가이드를 제공합니다.",
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://img-to-svg-six.vercel.app"}/blog`,
  },
};

export default function BlogIndex() {
  const posts = getAllPosts();

  return (
    <main className="max-w-4xl mx-auto px-4 py-16">
      {/* Header */}
      <div className="mb-12">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-[#1b1b24]/50 hover:text-[#383fd9] transition-colors mb-8"
        >
          ← 변환기로 돌아가기
        </Link>
        <h1 className="text-4xl font-bold mb-3 text-[#1b1b24] font-headline">블로그</h1>
        <p className="text-[#1b1b24]/60">
          SVG 변환 팁, 디자인 워크플로우, 피그마 활용 가이드
        </p>
      </div>

      {/* Post list */}
      {posts.length === 0 ? (
        <p className="text-[#1b1b24]/40">아직 게시글이 없습니다.</p>
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
                  <span className="text-xs text-[#1b1b24]/40">{post.readingTime}분 읽기</span>
                </div>
                <h2 className="text-xl font-semibold mb-2 text-[#1b1b24] group-hover:text-[#383fd9] transition-colors font-headline leading-snug">
                  {post.title}
                </h2>
                <p className="text-[#1b1b24]/60 text-sm leading-relaxed line-clamp-2">
                  {post.description}
                </p>
                <span className="inline-flex items-center gap-1 mt-4 text-sm font-medium text-[#383fd9]">
                  읽기
                  <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

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
    <main className="max-w-3xl mx-auto px-4 py-16">
      <div className="mb-12">
        <Link
          href="/"
          className="text-sm text-gray-400 hover:text-white transition-colors"
        >
          ← 변환기로 돌아가기
        </Link>
        <h1 className="text-4xl font-bold mt-6 mb-3">블로그</h1>
        <p className="text-gray-400">
          SVG 변환 팁, 디자인 워크플로우, 피그마 활용 가이드
        </p>
      </div>

      {posts.length === 0 ? (
        <p className="text-gray-500">아직 게시글이 없습니다.</p>
      ) : (
        <ul className="space-y-8">
          {posts.map((post) => (
            <li key={post.slug} className="border-b border-white/10 pb-8">
              <Link href={`/blog/${post.slug}`} className="group block">
                <time className="text-xs text-gray-500">{post.date}</time>
                <h2 className="text-xl font-semibold mt-1 mb-2 group-hover:text-indigo-400 transition-colors">
                  {post.title}
                </h2>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {post.description}
                </p>
                <span className="inline-block mt-3 text-sm text-indigo-400 group-hover:underline">
                  읽기 →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

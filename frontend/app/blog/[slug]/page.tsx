import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllSlugs, getPostBySlug } from "../lib/posts";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://img-to-svg-six.vercel.app";

  return {
    title: `${post.title} | imgtosvg`,
    description: post.description,
    keywords: post.keywords,
    alternates: {
      canonical: `${siteUrl}/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `${siteUrl}/blog/${post.slug}`,
      type: "article",
      publishedTime: post.date,
    },
  };
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: { "@type": "Organization", name: "imgtosvg" },
  };

  return (
    <main className="max-w-3xl mx-auto px-4 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mb-8">
        <Link
          href="/blog"
          className="text-sm text-gray-400 hover:text-white transition-colors"
        >
          ← 블로그 목록
        </Link>
      </div>

      <time className="text-xs text-gray-500">{post.date}</time>
      <h1 className="text-3xl font-bold mt-2 mb-8">{post.title}</h1>

      <article className="prose prose-invert prose-lg max-w-none
        prose-headings:font-semibold
        prose-h2:text-xl prose-h2:mt-10 prose-h2:mb-4
        prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-2
        prose-p:text-gray-300 prose-p:leading-relaxed
        prose-li:text-gray-300
        prose-strong:text-white
        prose-table:text-sm
        prose-td:text-gray-300 prose-th:text-white
        prose-a:text-indigo-400 prose-a:no-underline hover:prose-a:underline
        prose-blockquote:border-indigo-500 prose-blockquote:text-gray-400
        prose-code:text-indigo-300 prose-code:bg-white/5 prose-code:px-1 prose-code:rounded">
        <MDXRemote source={post.content} />
      </article>

      <div className="mt-16 p-6 bg-indigo-600/20 border border-indigo-500/30 rounded-xl text-center">
        <p className="text-lg font-semibold mb-2">
          지금 바로 무료로 변환해보세요
        </p>
        <p className="text-gray-400 text-sm mb-4">
          회원가입 없이 PNG, JPG, WebP → SVG 즉시 변환
        </p>
        <Link
          href="/"
          className="inline-block bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-6 py-2.5 rounded-lg transition-colors"
        >
          변환기 사용하기 →
        </Link>
      </div>
    </main>
  );
}

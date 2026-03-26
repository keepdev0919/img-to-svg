import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
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

      {/* Back link */}
      <Link
        href="/blog"
        className="inline-flex items-center gap-1 text-sm text-[#1b1b24]/50 hover:text-[#383fd9] transition-colors mb-10"
      >
        ← 블로그 목록
      </Link>

      {/* Article header */}
      <header className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <time className="inline-flex items-center px-3 py-1 rounded-full bg-[#efecf9] text-xs text-[#383fd9] font-medium">
            {post.date}
          </time>
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#efecf9] text-xs text-[#1b1b24]/60">
            {post.readingTime}분 읽기
          </span>
        </div>
        <h1 className="text-3xl font-bold text-[#1b1b24] font-headline leading-tight mb-4">
          {post.title}
        </h1>
        <p className="text-[#1b1b24]/60 leading-relaxed">{post.description}</p>
        <div className="mt-6 border-t border-[#c6c5d8]/40" />
      </header>

      {/* Article body */}
      <article className="prose prose-lg max-w-none
        prose-headings:font-semibold prose-headings:text-[#1b1b24] prose-headings:font-headline
        prose-h2:text-xl prose-h2:mt-10 prose-h2:mb-4
        prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-2
        prose-p:text-[#1b1b24]/80 prose-p:leading-relaxed
        prose-li:text-[#1b1b24]/80
        prose-strong:text-[#1b1b24]
        prose-table:text-sm prose-table:border-collapse
        prose-thead:bg-[#efecf9]
        prose-th:text-[#1b1b24] prose-th:font-semibold prose-th:px-4 prose-th:py-2
        prose-td:text-[#1b1b24]/70 prose-td:px-4 prose-td:py-2 prose-td:border prose-td:border-[#c6c5d8]/40
        prose-tr:border-b prose-tr:border-[#c6c5d8]/30
        prose-a:text-[#383fd9] prose-a:no-underline hover:prose-a:underline prose-a:font-medium
        prose-blockquote:border-l-[#383fd9] prose-blockquote:bg-[#efecf9] prose-blockquote:rounded-r-lg prose-blockquote:py-1 prose-blockquote:text-[#1b1b24]/70
        prose-code:text-[#383fd9] prose-code:bg-[#383fd9]/8 prose-code:px-1.5 prose-code:rounded prose-code:text-sm prose-code:font-medium prose-code:before:content-none prose-code:after:content-none">
        <MDXRemote source={post.content} options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }} />
      </article>

      {/* CTA */}
      <div className="mt-16 p-8 bg-gradient-to-br from-[#383fd9]/10 to-[#535bf2]/10 border border-[#383fd9]/20 rounded-2xl text-center">
        <p className="text-lg font-semibold mb-1 text-[#1b1b24] font-headline">
          지금 바로 무료로 변환해보세요
        </p>
        <p className="text-[#1b1b24]/60 text-sm mb-5">
          회원가입 없이 PNG, JPG, WebP → SVG 즉시 변환
        </p>
        <Link
          href="/"
          className="inline-block bg-gradient-to-br from-[#383fd9] to-[#535bf2] hover:opacity-90 text-white font-semibold px-7 py-3 rounded-full transition-all active:scale-95"
        >
          변환기 사용하기 →
        </Link>
      </div>
    </main>
  );
}

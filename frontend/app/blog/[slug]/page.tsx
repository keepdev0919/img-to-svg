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

      <div className="mb-8">
        <Link
          href="/blog"
          className="text-sm text-[#1b1b24]/50 hover:text-[#383fd9] transition-colors"
        >
          ← 블로그 목록
        </Link>
      </div>

      <time className="text-xs text-[#1b1b24]/40">{post.date}</time>
      <h1 className="text-3xl font-bold mt-2 mb-8 text-[#1b1b24]">{post.title}</h1>

      <article className="prose prose-lg max-w-none
        prose-headings:font-semibold prose-headings:text-[#1b1b24]
        prose-h2:text-xl prose-h2:mt-10 prose-h2:mb-4
        prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-2
        prose-p:text-[#1b1b24]/80 prose-p:leading-relaxed
        prose-li:text-[#1b1b24]/80
        prose-strong:text-[#1b1b24]
        prose-table:text-sm
        prose-td:text-[#1b1b24]/70 prose-th:text-[#1b1b24]
        prose-a:text-[#383fd9] prose-a:no-underline hover:prose-a:underline
        prose-blockquote:border-[#383fd9] prose-blockquote:text-[#1b1b24]/60
        prose-code:text-[#383fd9] prose-code:bg-[#383fd9]/10 prose-code:px-1 prose-code:rounded">
        <MDXRemote source={post.content} options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }} />
      </article>

      <div className="mt-16 p-6 bg-[#383fd9]/10 border border-[#383fd9]/30 rounded-xl text-center">
        <p className="text-lg font-semibold mb-2 text-[#1b1b24]">
          지금 바로 무료로 변환해보세요
        </p>
        <p className="text-[#1b1b24]/60 text-sm mb-4">
          회원가입 없이 PNG, JPG, WebP → SVG 즉시 변환
        </p>
        <Link
          href="/"
          className="inline-block bg-[#383fd9] hover:bg-[#535bf2] text-white font-medium px-6 py-2.5 rounded-lg transition-colors"
        >
          변환기 사용하기 →
        </Link>
      </div>
    </main>
  );
}

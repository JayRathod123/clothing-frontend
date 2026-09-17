import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Container } from '@/components/layout/Container';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { BLOG_POSTS } from '@/constants/blogData';
import { ArrowLeft, Clock, Calendar, User, Share2, Tag } from 'lucide-react';
import type { Metadata } from 'next';

interface BlogDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) return { title: 'Article Not Found | KINETIC // STUDIO' };

  return {
    title: `${post.title} | KINETIC // STUDIO`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [{ url: post.coverImage }],
    },
  };
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = BLOG_POSTS.filter((p) => p.slug !== slug).slice(0, 2);

  return (
    <article className="py-8 min-h-screen bg-white">
      <Container size="md">
        <Breadcrumb
          items={[
            { label: 'Blog', href: '/blogs' },
            { label: post.title },
          ]}
        />

        {/* Article Header */}
        <div className="pt-6 pb-8 space-y-4 text-center">
          <span className="inline-block text-[11px] font-black uppercase tracking-[0.25em] text-red-600 bg-red-50 px-3 py-1 border border-red-100">
            {post.category}
          </span>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-neutral-900 leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center justify-center gap-4 text-xs font-medium text-neutral-500 pt-2">
            <span>By <strong className="text-neutral-900">{post.author}</strong> ({post.authorRole})</span>
            <span>•</span>
            <span>{post.publishedAt}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> {post.readTime}
            </span>
          </div>
        </div>

        {/* Cover Image */}
        <div className="relative w-full h-[320px] sm:h-[460px] my-6 overflow-hidden border border-neutral-200">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 800px"
            className="object-cover object-center"
          />
        </div>

        {/* Content Prose */}
        <div className="pt-8 max-w-2xl mx-auto space-y-6 text-neutral-800 text-sm sm:text-base leading-relaxed font-normal">
          <p className="text-base sm:text-lg font-medium text-neutral-900 border-l-2 border-black pl-4 py-1 italic leading-relaxed">
            "{post.excerpt}"
          </p>

          {post.content.map((paragraph, idx) => (
            <p key={idx} className="leading-relaxed">
              {paragraph}
            </p>
          ))}

          {/* Tags */}
          <div className="pt-8 border-t border-neutral-200 flex items-center gap-2 flex-wrap">
            <Tag className="w-3.5 h-3.5 text-neutral-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 mr-2">Tags:</span>
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs bg-neutral-100 text-neutral-700 px-2.5 py-1 font-medium border border-neutral-200"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Share & Back */}
          <div className="pt-6 flex items-center justify-between border-t border-neutral-200">
            <Link
              href="/blogs"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-neutral-900 hover:text-neutral-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Journal</span>
            </Link>
          </div>
        </div>

        {/* Related Reads */}
        {relatedPosts.length > 0 && (
          <div className="mt-16 pt-12 border-t border-neutral-200">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-neutral-900 mb-6">
              Related Articles
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {relatedPosts.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/blogs/${rel.slug}`}
                  className="group p-4 bg-neutral-50 border border-neutral-200 hover:border-black transition-colors block"
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider text-red-600">
                    {rel.category}
                  </span>
                  <h4 className="text-sm font-bold uppercase tracking-tight text-neutral-900 group-hover:text-neutral-600 transition-colors mt-1 line-clamp-2">
                    {rel.title}
                  </h4>
                  <span className="text-[11px] text-neutral-400 mt-2 block">
                    {rel.readTime}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </Container>
    </article>
  );
}

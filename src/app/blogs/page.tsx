import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Container } from '@/components/layout/Container';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { BLOG_POSTS } from '@/constants/blogData';
import { ArrowRight, Clock, Calendar, User } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Streetwear Journal & Textile Insights | KINETIC // STUDIO',
  description: 'Explore our latest design philosophies, 240 GSM fabric engineering, oversized styling guides, and limited drop lookbooks.',
};

export default function BlogsPage() {
  const [featuredPost, ...otherPosts] = BLOG_POSTS;

  return (
    <div className="py-8 min-h-screen bg-neutral-50/50">
      <Container>
        <Breadcrumb items={[{ label: 'Blog' }]} />

        {/* Header */}
        <div className="pt-4 pb-10 border-b border-neutral-200">
          <span className="text-[11px] font-black uppercase tracking-[0.25em] text-red-600 block mb-2">
            EDITORIAL JOURNAL
          </span>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-neutral-900">
            The Streetwear Journal
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 max-w-xl mt-2 font-normal leading-relaxed">
            A considered exploration of heavyweight cotton textiles, silhouette construction, styling philosophies, and limited drop announcements.
          </p>
        </div>

        {/* Featured Post */}
        {featuredPost && (
          <div className="pt-10 pb-16 border-b border-neutral-200">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white border border-neutral-200 overflow-hidden group">
              <div className="lg:col-span-7 relative h-[340px] sm:h-[460px] overflow-hidden">
                <Image
                  src={featuredPost.coverImage}
                  alt={featuredPost.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover object-center transform transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 bg-black text-white text-[10px] font-black uppercase tracking-widest px-3 py-1">
                  FEATURED ESSAY
                </div>
              </div>

              <div className="lg:col-span-5 p-6 sm:p-10 space-y-4">
                <div className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                  <span className="text-red-600">{featuredPost.category}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {featuredPost.readTime}
                  </span>
                </div>

                <Link href={`/blogs/${featuredPost.slug}`}>
                  <h2 className="text-xl sm:text-3xl font-black uppercase tracking-tight text-neutral-900 hover:text-neutral-600 transition-colors leading-snug">
                    {featuredPost.title}
                  </h2>
                </Link>

                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal">
                  {featuredPost.excerpt}
                </p>

                <div className="pt-2 flex items-center justify-between border-t border-neutral-100">
                  <span className="text-xs text-neutral-400 font-medium">
                    By {featuredPost.author}
                  </span>

                  <Link
                    href={`/blogs/${featuredPost.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-black hover:text-neutral-600 transition-colors"
                  >
                    <span>Read Article</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Other Articles Grid */}
        <div className="pt-12">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-neutral-900 mb-8">
            Recent Publications & Styling Guides
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {otherPosts.map((post) => (
              <div
                key={post.id}
                className="bg-white border border-neutral-200 flex flex-col justify-between overflow-hidden group hover:border-neutral-400 transition-colors"
              >
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover object-center transform transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-black text-[10px] font-bold uppercase tracking-widest px-2.5 py-1">
                    {post.category}
                  </div>
                </div>

                <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[11px] font-medium text-neutral-400">
                      <span>{post.publishedAt}</span>
                      <span>•</span>
                      <span>{post.readTime}</span>
                    </div>

                    <Link href={`/blogs/${post.slug}`}>
                      <h4 className="text-lg font-black uppercase tracking-tight text-neutral-900 hover:text-neutral-600 transition-colors line-clamp-2">
                        {post.title}
                      </h4>
                    </Link>

                    <p className="text-xs text-neutral-600 line-clamp-3 leading-relaxed font-normal">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                    <span className="text-xs text-neutral-500 font-medium">By {post.author}</span>
                    <Link
                      href={`/blogs/${post.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-black hover:text-neutral-600 transition-colors"
                    >
                      <span>Read</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}

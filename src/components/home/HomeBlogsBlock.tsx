import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Container } from '@/components/layout/Container';
import { Calendar, User } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  date: string;
  author: string;
  image: string;
}

const INKSTYLES_BLOGS: BlogPost[] = [
  {
    id: 'blog-1',
    title: 'The Ramen Anatomy Hoodie: Streetwear Made for Food Lovers & Culture Nerds',
    slug: 'the-ramen-anatomy-hoodie',
    date: 'January 15, 2026',
    author: 'by: Aditya Jain',
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'blog-2',
    title: 'New Arrival: Ramen and Faith Hoodies & Heavyweight Street Silhouettes',
    slug: 'new-arrival-ramen-and-faith-hoodies',
    date: 'January 11, 2026',
    author: 'by: Aditya Jain',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'blog-3',
    title: 'Fortitude: A Hoodie for the Days You Need Strength & Unstoppable Comfort',
    slug: 'fortitude-a-hoodie-for-strength',
    date: 'December 04, 2025',
    author: 'by: Aditya Jain',
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=800&auto=format&fit=crop',
  },
];

export function HomeBlogsBlock() {
  return (
    <section className="py-16 bg-[#FFFFFF] border-t border-neutral-100">
      <Container>
        <div className="text-center mb-10 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
            Latest Blog
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 max-w-md mx-auto">
            Stories, fabric insights, and the culture behind our streetwear designs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {INKSTYLES_BLOGS.map((post) => (
            <article key={post.id} className="group flex flex-col space-y-3">
              <Link href={`/blogs/${post.slug}`} className="block relative aspect-16/9 rounded-xl overflow-hidden bg-neutral-100 shadow-2xs">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover object-center transform transition-transform duration-500 group-hover:scale-105"
                />
              </Link>

              {/* Meta: Date & Author */}
              <div className="flex items-center gap-4 text-[11px] text-neutral-500 font-medium">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                  {post.date}
                </span>
                <span className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-neutral-400" />
                  {post.author}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-sm sm:text-base font-bold text-neutral-900 group-hover:text-sky-600 transition-colors line-clamp-2 leading-snug">
                <Link href={`/blogs/${post.slug}`}>
                  {post.title}
                </Link>
              </h3>

              {/* Read More link */}
              <Link
                href={`/blogs/${post.slug}`}
                className="text-xs font-semibold text-neutral-900 hover:text-sky-600 underline underline-offset-4 transition-colors pt-1 inline-block"
              >
                Read More
              </Link>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}

export default HomeBlogsBlock;

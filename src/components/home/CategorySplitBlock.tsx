import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface CollectionBanner {
  id: string;
  tagline: string;
  title: string;
  description: string;
  href: string;
  image: string;
}

const COLLECTIONS: CollectionBanner[] = [
  {
    id: 'oversized',
    tagline: 'RELAXED FIT',
    title: 'Oversized T-Shirt.',
    description: 'Street-ready drops cut with architectural boxy proportions and heavy drape.',
    href: '/shop?fit=oversized',
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=1000&auto=format&fit=crop',
  },
  {
    id: 'regular',
    tagline: 'EVERYDAY COMFORT',
    title: 'Regular Fit T-Shirt.',
    description: 'Clean classic cuts crafted from ultra-soft bio-washed combed cotton.',
    href: '/shop?fit=regular',
    image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=1000&auto=format&fit=crop',
  },
  {
    id: 'tops',
    tagline: 'EVERYDAY STYLE TOP',
    title: 'Tops Collection.',
    description: 'Cropped silhouettes and form-accentuating fits designed for effortless movement.',
    href: '/shop?category=tops',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop',
  },
  {
    id: 'tank-tops',
    tagline: 'LIGHT LAYERS BOLD ATTITUDE',
    title: 'Tank Top Collection.',
    description: 'Discover our tank top collection made for movement, comfort, and street-ready style.',
    href: '/shop?category=tank-tops',
    image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=1000&auto=format&fit=crop',
  },
  {
    id: 'hoodies',
    tagline: 'HOODIE COLLECTION',
    title: 'Hoodie Collection.',
    description: 'Premium hoodies built for comfort, warmth, and everyday streetwear style.',
    href: '/shop?category=hoodies',
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=1000&auto=format&fit=crop',
  },
  {
    id: 'customized',
    tagline: 'YOUR IDEA, OUR CREATION',
    title: 'Costumized T-Shirt.',
    description: 'Design it your way. From custom graphics to personal messages — make it truly yours.',
    href: '/shop?category=customized',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1000&auto=format&fit=crop',
  },
];

export function CategorySplitBlock() {
  return (
    <section className="w-full bg-[#FFFFFF] py-14 px-4 sm:px-6 lg:px-8 border-t border-neutral-100">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
            Shop by Collection
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 max-w-xl mx-auto">
            Explore curated capsules designed for everyday rotation, streetwear confidence, and all-day comfort.
          </p>
        </div>

        {/* 3-Column Dark Mood Banners matching InkStyles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {COLLECTIONS.map((col) => (
            <Link
              key={col.id}
              href={col.href}
              className="group relative h-[280px] sm:h-[300px] rounded-2xl overflow-hidden bg-neutral-900 shadow-sm transition-all duration-300 hover:shadow-xl block"
            >
              {/* Image side */}
              <div className="absolute top-0 right-0 bottom-0 w-1/2 overflow-hidden">
                <Image
                  src={col.image}
                  alt={col.title}
                  fill
                  sizes="(max-width: 768px) 50vw, 20vw"
                  className="object-cover object-center transform transition-transform duration-700 group-hover:scale-108"
                />
              </div>

              {/* Gradient dark wash over the card */}
              <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-900/90 to-transparent z-10" />

              {/* Content on the left */}
              <div className="relative z-20 h-full w-[65%] p-6 sm:p-7 flex flex-col justify-between text-white">
                <div className="space-y-2">
                  <span className="text-[10px] font-bold tracking-[0.2em] text-neutral-400 uppercase block">
                    {col.tagline}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white group-hover:text-sky-400 transition-colors leading-tight">
                    {col.title}
                  </h3>
                </div>

                <div className="space-y-3">
                  <p className="text-[11px] text-neutral-300 leading-relaxed font-normal line-clamp-3">
                    {col.description}
                  </p>
                  <div className="w-12 h-0.5 bg-neutral-600 group-hover:w-16 group-hover:bg-sky-400 transition-all duration-300" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CategorySplitBlock;

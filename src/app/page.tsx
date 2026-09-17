import { HeroBlock } from '@/components/home/HeroBlock';
import { FeaturedProductsBlock } from '@/components/home/FeaturedProductsBlock';
import { CategorySplitBlock } from '@/components/home/CategorySplitBlock';
import { WatchAndBuyBlock } from '@/components/home/WatchAndBuyBlock';
import { SocialProofBlock } from '@/components/home/SocialProofBlock';
import { TrustBadgesStrip } from '@/components/home/TrustBadgesStrip';
import { HomeBlogsBlock } from '@/components/home/HomeBlogsBlock';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Graphic T-Shirts, Tops & More | Inkstyles',
  description:
    'Discover unique graphic T-shirts, oversized tees and trendy tops at Inkstyles. Bold designs, quality prints and styles for men & women who want to stand out. Shop now.',
};

export default function HomePage() {
  return (
    <div className="flex flex-col w-full bg-white">
      {/* 1. Lifestyle Streetwear Hero Carousel */}
      <HeroBlock />

      {/* 2. New Arrivals Collection Grid with Tabs */}
      <FeaturedProductsBlock />

      {/* 3. Shop by Collection (3-Column Dark Mood Banners) */}
      <CategorySplitBlock />

      {/* 4. Watch and Buy (Vertical Reels Showcase) */}
      <WatchAndBuyBlock />

      {/* 5. Customer Words (Testimonials with 5-Star Reviews) */}
      <SocialProofBlock />

      {/* 6. Trust Badges Strip & Give your Feedback Banner */}
      <TrustBadgesStrip />

      {/* 7. Latest Blog Section */}
      <HomeBlogsBlock />
    </div>
  );
}

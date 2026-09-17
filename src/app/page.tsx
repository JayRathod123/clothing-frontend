import { HeroBlock } from '@/components/home/HeroBlock';
import { FeaturedProductsBlock } from '@/components/home/FeaturedProductsBlock';
import { CategorySplitBlock } from '@/components/home/CategorySplitBlock';
import { BrandStatementBlock } from '@/components/home/BrandStatementBlock';
import { ProductStoryBlock } from '@/components/home/ProductStoryBlock';
import { BestsellersBlock } from '@/components/home/BestsellersBlock';
import { FabricStoryBlock } from '@/components/home/FabricStoryBlock';
import { SocialProofBlock } from '@/components/home/SocialProofBlock';
import { FinalCtaBlock } from '@/components/home/FinalCtaBlock';

export default function HomePage() {
  return (
    <div className="flex flex-col w-full">
      {/* Hero section */}
      <HeroBlock />

      {/* New Arrivals (Simple, clean, balanced 4-column product grid) */}
      <FeaturedProductsBlock />

      {/* Category split: T-Shirts & Shirts */}
      <CategorySplitBlock />

      {/* Whitespace-driven Brand Statement */}
      <BrandStatementBlock />

      {/* 'Why This Piece' Product Story */}
      <ProductStoryBlock />

      {/* Most Wanted Bestsellers */}
      <BestsellersBlock />

      {/* Fabric & Craftsmanship Material Story */}
      <FabricStoryBlock />

      {/* Social Proof & Lookbook */}
      <SocialProofBlock />

      {/* Final Call-To-Action */}
      <FinalCtaBlock />
    </div>
  );
}

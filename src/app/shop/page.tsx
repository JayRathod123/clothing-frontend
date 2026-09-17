import { ProductListingView } from '@/components/product/ProductListingView';

export const metadata = {
  title: 'All Contemporary Pieces | AURA STUDIO',
  description: 'Explore the complete capsule of heavyweight cotton tees, structured overshirts, and tailored trousers.',
};

export default function ShopPage() {
  return (
    <ProductListingView
      title="ALL PIECES"
      subtitle="Contemporary silhouettes, considered cuts, and 240 GSM signature essentials."
    />
  );
}

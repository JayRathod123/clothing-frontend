import { ProductListingView } from '@/components/product/ProductListingView';
import { MOCK_COLLECTIONS } from '@/constants/mockData';

interface CollectionPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: CollectionPageProps) {
  const { slug } = await params;
  const collection = MOCK_COLLECTIONS.find((c) => c.slug === slug);
  return {
    title: `${collection?.name || 'Curated Series'} | AURA STUDIO`,
    description: collection?.description || 'Curated fashion series and seasonal editorial drops.',
  };
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { slug } = await params;
  const collection = MOCK_COLLECTIONS.find((c) => c.slug === slug);

  return (
    <ProductListingView
      title={collection?.name || slug.replace('-', ' ').toUpperCase()}
      subtitle={collection?.description || 'Limited seasonal release crafted with considered textiles.'}
    />
  );
}

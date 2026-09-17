import { ProductListingView } from '@/components/product/ProductListingView';
import { collectionService } from '@/services/collection.service';

interface CollectionPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: CollectionPageProps) {
  const { slug } = await params;
  const collection = await collectionService.getCollectionBySlug(slug);
  return {
    title: `${collection?.name || 'Curated Series'} | INKSTYLES`,
    description: collection?.description || 'Curated fashion series and seasonal drops.',
  };
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { slug } = await params;
  const collection = await collectionService.getCollectionBySlug(slug);

  return (
    <ProductListingView
      title={collection?.name || slug.replace('-', ' ').toUpperCase()}
      subtitle={collection?.description || 'Limited seasonal release crafted with considered textiles.'}
    />
  );
}

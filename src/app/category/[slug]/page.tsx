import { ProductListingView } from '@/components/product/ProductListingView';
import { MOCK_CATEGORIES } from '@/constants/mockData';
import { notFound } from 'next/navigation';

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = MOCK_CATEGORIES.find((c) => c.slug === slug);
  return {
    title: `${category?.name || 'Category'} | AURA STUDIO`,
    description: category?.description || 'Contemporary menswear silhouettes and essentials.',
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = MOCK_CATEGORIES.find((c) => c.slug === slug);

  if (!category) {
    // If not found in mock, still render nicely or return 404
    return (
      <ProductListingView
        title={slug.replace('-', ' ').toUpperCase()}
        subtitle="Everyday silhouettes engineered for contemporary rotation."
      />
    );
  }

  return (
    <ProductListingView
      title={category.name.toUpperCase()}
      subtitle={category.description}
      initialCategoryId={category.id}
    />
  );
}

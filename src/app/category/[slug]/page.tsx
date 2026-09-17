import { ProductListingView } from '@/components/product/ProductListingView';
import { categoryService } from '@/services/category.service';

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = await categoryService.getCategoryBySlug(slug);
  return {
    title: `${category?.name || 'Category'} | INKSTYLES`,
    description: category?.description || 'Contemporary silhouettes and essentials.',
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = await categoryService.getCategoryBySlug(slug);

  return (
    <ProductListingView
      title={(category?.name || slug.replace('-', ' ')).toUpperCase()}
      subtitle={category?.description || 'Everyday silhouettes engineered for contemporary rotation.'}
      initialCategoryId={category?.id}
    />
  );
}

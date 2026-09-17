import { useQuery } from '@tanstack/react-query';
import { categoryService } from '@/services/category.service';
import { CategoryFilterParams } from '@/types/category.types';

export function useCategories(params?: CategoryFilterParams) {
  return useQuery({
    queryKey: ['categories', params],
    queryFn: () => categoryService.getCategories(params),
  });
}

export function useCategoryTree() {
  return useQuery({
    queryKey: ['categoryTree'],
    queryFn: () => categoryService.getCategoryTree(),
  });
}

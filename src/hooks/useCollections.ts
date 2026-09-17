import { useQuery } from '@tanstack/react-query';
import { collectionService } from '@/services/collection.service';
import { CollectionFilterParams } from '@/types/collection.types';

export function useCollections(params?: CollectionFilterParams) {
  return useQuery({
    queryKey: ['collections', params],
    queryFn: () => collectionService.getCollections(params),
  });
}

export function useCollection(slug: string) {
  return useQuery({
    queryKey: ['collection', slug],
    queryFn: () => collectionService.getCollectionBySlug(slug),
    enabled: Boolean(slug),
  });
}

export function useCollectionProducts(slug: string) {
  return useQuery({
    queryKey: ['collectionProducts', slug],
    queryFn: () => collectionService.getCollectionProducts(slug),
    enabled: Boolean(slug),
  });
}

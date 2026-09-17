import { useQuery } from '@tanstack/react-query';
import { productService } from '@/services/product.service';
import { useState, useEffect } from 'react';

export function useSearch(initialTerm: string = '') {
  const [searchTerm, setSearchTerm] = useState(initialTerm);
  const [debouncedTerm, setDebouncedTerm] = useState(initialTerm);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 250);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const query = useQuery({
    queryKey: ['search', debouncedTerm],
    queryFn: () => productService.getProducts({ search: debouncedTerm, limit: 8 }),
    enabled: debouncedTerm.trim().length >= 2,
  });

  return {
    searchTerm,
    setSearchTerm,
    debouncedTerm,
    results: query.data?.items || [],
    isLoading: query.isLoading && debouncedTerm.trim().length >= 2,
    total: query.data?.total || 0,
  };
}

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { wishlistService } from '@/services/wishlist.service';
import { useAuth } from '@/hooks/useAuth';

export function useWishlist() {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();

  const query = useQuery({
    queryKey: ['wishlist', isAuthenticated],
    queryFn: () => wishlistService.getWishlist(),
    enabled: Boolean(isAuthenticated),
    staleTime: 1000 * 60 * 2,
  });

  const addMutation = useMutation({
    mutationFn: ({ productId, variantId }: { productId: string; variantId?: string }) =>
      wishlistService.addItem(productId, variantId),
    onSuccess: (updated) => {
      queryClient.setQueryData(['wishlist', isAuthenticated], updated);
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    },
  });

  const removeMutation = useMutation({
    mutationFn: (itemId: string) => wishlistService.removeItem(itemId),
    onSuccess: (updated) => {
      queryClient.setQueryData(['wishlist', isAuthenticated], updated);
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    },
  });

  const moveToCartMutation = useMutation({
    mutationFn: (itemId: string) => wishlistService.moveToCart(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  const isItemInWishlist = (productId: string) => {
    if (!isAuthenticated) return false;
    return query.data?.items?.some(i => i.productId === productId || i.id === productId) || false;
  };

  return {
    wishlist: isAuthenticated ? query.data : null,
    items: isAuthenticated ? (query.data?.items || []) : [],
    totalItems: isAuthenticated ? (query.data?.totalItems || query.data?.items?.length || 0) : 0,
    isLoading: isAuthenticated ? query.isLoading : false,
    isItemInWishlist,
    isLoggedIn: isAuthenticated,
    addToWishlist: addMutation.mutateAsync,
    removeFromWishlist: removeMutation.mutateAsync,
    moveToCart: moveToCartMutation.mutateAsync,
  };
}

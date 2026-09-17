import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { wishlistService } from '@/services/wishlist.service';

export function useWishlist() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['wishlist'],
    queryFn: () => wishlistService.getWishlist(),
  });

  const addMutation = useMutation({
    mutationFn: ({ productId, variantId }: { productId: string; variantId?: string }) =>
      wishlistService.addItem(productId, variantId),
    onSuccess: (updated) => {
      queryClient.setQueryData(['wishlist'], updated);
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    },
  });

  const removeMutation = useMutation({
    mutationFn: (itemId: string) => wishlistService.removeItem(itemId),
    onSuccess: (updated) => {
      queryClient.setQueryData(['wishlist'], updated);
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
    return query.data?.items?.some(i => i.productId === productId) || false;
  };

  return {
    wishlist: query.data,
    items: query.data?.items || [],
    totalItems: query.data?.totalItems || 0,
    isLoading: query.isLoading,
    isItemInWishlist,
    addToWishlist: addMutation.mutateAsync,
    removeFromWishlist: removeMutation.mutateAsync,
    moveToCart: moveToCartMutation.mutateAsync,
  };
}

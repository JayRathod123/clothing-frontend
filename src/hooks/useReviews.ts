import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewService } from '@/services/review.service';
import { CreateReviewDto, ReviewSummary } from '@/types/review.types';

export function useProductReviews(productId: string, initialData?: ReviewSummary) {
  return useQuery({
    queryKey: ['reviews', productId],
    queryFn: () => reviewService.getProductReviews(productId),
    enabled: !!productId,
    initialData: initialData && initialData.reviews.length > 0 ? initialData : undefined,
  });
}

export function useSubmitReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateReviewDto) => reviewService.submitReview(dto),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', variables.productId] });
      queryClient.invalidateQueries({ queryKey: ['my-reviews'] });
    },
  });
}

export function useMyReviews() {
  return useQuery({
    queryKey: ['my-reviews'],
    queryFn: () => reviewService.getMyReviews(),
  });
}

import axiosInstance from '@/lib/axiosInstance';
import { Review, ReviewSummary, CreateReviewDto } from '@/types/review.types';
import { ApiResponse } from '@/types/api.types';

export const reviewService = {
  // Get product reviews directly from live API
  async getProductReviews(productId: string): Promise<ReviewSummary> {
    try {
      const response = await axiosInstance.get<ApiResponse<any>>(`/api/reviews/product/${productId}`);
      if (response.data.success && response.data.data) {
        const raw = response.data.data;
        const reviewList: Review[] = (raw.data || raw.items || []).map((r: any) => ({
          id: r.id,
          productId: r.productId || productId,
          customerName: r.customerName || r.user?.name || 'Verified Customer',
          rating: Number(r.rating || 5),
          title: r.title || 'Product Review',
          comment: r.comment || '',
          isVerifiedPurchase: r.isVerifiedPurchase ?? true,
          status: r.status || 'approved',
          createdAt: r.createdAt || new Date().toISOString(),
        }));

        const breakdown = raw.ratingSummary?.breakdown || {
          5: reviewList.filter(r => r.rating === 5).length,
          4: reviewList.filter(r => r.rating === 4).length,
          3: reviewList.filter(r => r.rating === 3).length,
          2: reviewList.filter(r => r.rating === 2).length,
          1: reviewList.filter(r => r.rating === 1).length,
        };

        const totalReviews = Number(raw.ratingSummary?.totalReviews ?? reviewList.length);
        const averageRating = Number(raw.ratingSummary?.averageRating ?? (
          reviewList.length > 0 
            ? (reviewList.reduce((acc, r) => acc + r.rating, 0) / reviewList.length).toFixed(1)
            : 0
        ));

        return {
          averageRating,
          totalReviews,
          ratingBreakdown: breakdown,
          reviews: reviewList,
        };
      }
    } catch (err) {
      console.warn(`API /api/reviews/product/${productId} error:`, err);
    }

    return {
      averageRating: 0,
      totalReviews: 0,
      ratingBreakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      reviews: [],
    };
  },

  // Submit a review directly to live API
  async submitReview(dto: CreateReviewDto): Promise<Review> {
    const response = await axiosInstance.post<ApiResponse<Review>>('/api/reviews', dto);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error('Failed to submit review');
  }
};

export default reviewService;

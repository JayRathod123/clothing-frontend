import axiosInstance from '@/lib/axiosInstance';
import { Review, ReviewSummary, CreateReviewDto } from '@/types/review.types';
import { ApiResponse } from '@/types/api.types';
import { isUserLoggedIn } from '@/utils/storage';

export const reviewService = {
  // GET /api/reviews/product/{productId}
  // Get approved reviews and aggregate rating breakdown for a product
  async getProductReviews(productId: string): Promise<ReviewSummary> {
    try {
      const response = await axiosInstance.get<ApiResponse<any>>(`/api/reviews/product/${productId}`);
      const raw = response.data?.data !== undefined ? response.data.data : response.data;

      const rawList = Array.isArray(raw)
        ? raw
        : Array.isArray(raw?.reviews)
        ? raw.reviews
        : Array.isArray(raw?.items)
        ? raw.items
        : Array.isArray(raw?.data)
        ? raw.data
        : [];

      const reviewList: Review[] = rawList.map((r: any) => ({
        id: String(r.id || r._id || Math.random()),
        productId: String(r.productId || productId),
        customerName:
          r.customerName ||
          r.userName ||
          (r.user?.name ? r.user.name : '') ||
          (r.user?.firstName ? `${r.user.firstName} ${r.user.lastName || ''}`.trim() : '') ||
          'Verified Customer',
        rating: Math.min(5, Math.max(1, Number(r.rating || 5))),
        title: r.title || '',
        comment: r.comment || r.content || r.review || '',
        isVerifiedPurchase: r.isVerifiedPurchase ?? true,
        status: r.status || 'approved',
        createdAt: r.createdAt || new Date().toISOString(),
      }));

      // Calculate dynamic breakdown
      const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      reviewList.forEach((r) => {
        const star = Math.min(5, Math.max(1, Math.round(r.rating)));
        counts[star] = (counts[star] || 0) + 1;
      });

      const summary = raw?.ratingSummary || raw?.summary || raw?.breakdown;
      const totalReviews = Number(summary?.totalReviews ?? reviewList.length);
      const breakdown = summary?.breakdown || counts;

      const averageRating = totalReviews > 0
        ? Number(
            summary?.averageRating ??
            (reviewList.reduce((acc, r) => acc + r.rating, 0) / (reviewList.length || 1)).toFixed(1)
          )
        : 0;

      return {
        averageRating,
        totalReviews,
        ratingBreakdown: {
          1: breakdown[1] || counts[1] || 0,
          2: breakdown[2] || counts[2] || 0,
          3: breakdown[3] || counts[3] || 0,
          4: breakdown[4] || counts[4] || 0,
          5: breakdown[5] || counts[5] || 0,
        },
        reviews: reviewList,
      };
    } catch (err) {
      console.warn(`API /api/reviews/product/${productId} error:`, err);
    }

    return {
      averageRating: 0,
      totalReviews: 0,
      ratingBreakdown: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      reviews: [],
    };
  },

  // POST /api/reviews
  // Submit a product review (Customer)
  async submitReview(dto: CreateReviewDto): Promise<Review> {
    const payload = {
      productId: dto.productId,
      rating: Number(dto.rating),
      title: dto.title || '',
      comment: dto.comment,
      ...(dto.customerName ? { customerName: dto.customerName } : {}),
    };

    const response = await axiosInstance.post<ApiResponse<any>>('/api/reviews', payload);
    const raw = response.data?.data || response.data;

    return {
      id: String(raw?.id || raw?._id || `rev-${Date.now()}`),
      productId: dto.productId,
      customerName: raw?.customerName || dto.customerName || 'Verified Customer',
      rating: dto.rating,
      title: dto.title || '',
      comment: dto.comment,
      isVerifiedPurchase: true,
      status: raw?.status || 'approved',
      createdAt: raw?.createdAt || new Date().toISOString(),
    };
  },

  // GET /api/reviews/my-reviews
  // Get reviews submitted by the authenticated customer
  async getMyReviews(): Promise<Review[]> {
    try {
      const response = await axiosInstance.get<ApiResponse<any>>('/api/reviews/my-reviews');
      const raw = response.data?.data !== undefined ? response.data.data : response.data;
      const list = Array.isArray(raw)
        ? raw
        : Array.isArray(raw?.items)
        ? raw.items
        : Array.isArray(raw?.data)
        ? raw.data
        : [];

      return list.map((r: any) => ({
        id: String(r.id || r._id),
        productId: String(r.productId),
        customerName: r.customerName || 'You',
        rating: Number(r.rating || 5),
        title: r.title || '',
        comment: r.comment || r.content || '',
        isVerifiedPurchase: r.isVerifiedPurchase ?? true,
        status: r.status || 'approved',
        createdAt: r.createdAt || new Date().toISOString(),
      }));
    } catch (err) {
      console.warn('API /api/reviews/my-reviews error:', err);
      return [];
    }
  },
};

export default reviewService;

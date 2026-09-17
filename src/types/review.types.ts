export interface Review {
  id: string;
  productId: string;
  userId?: string;
  customerName: string;
  rating: number; // 1 to 5
  title?: string;
  comment: string;
  isVerifiedPurchase: boolean;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface ReviewSummary {
  averageRating: number;
  totalReviews: number;
  ratingBreakdown: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  reviews: Review[];
}

export interface CreateReviewDto {
  productId: string;
  rating: number;
  title?: string;
  comment: string;
  customerName?: string;
}

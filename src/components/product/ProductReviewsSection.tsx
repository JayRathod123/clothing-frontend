'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  Star,
  ThumbsUp,
  MessageSquarePlus,
  X,
  Check,
  Filter,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/hooks/useAuth';
import { useUI } from '@/context/UIContext';
import { useProductReviews, useSubmitReview } from '@/hooks/useReviews';
import { Review } from '@/types/review.types';
import { formatDate } from '@/utils/formatters';

interface ProductReviewsSectionProps {
  productId: string;
  productName: string;
  initialReviews?: Review[];
}

export function ProductReviewsSection({
  productId,
  productName,
  initialReviews = [],
}: ProductReviewsSectionProps) {
  const { isAuthenticated, user } = useAuth();
  const { showToast, openAuthModal } = useUI();

  // Dynamic Live Query from backend API
  const { data: reviewsData, isLoading } = useProductReviews(productId);
  const submitReviewMutation = useSubmitReview();

  const reviews = reviewsData?.reviews ?? initialReviews;
  const totalCount = reviewsData?.totalReviews ?? reviews.length;
  const avgRating = reviewsData?.averageRating
    ? Number(reviewsData.averageRating).toFixed(1)
    : reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  // Dynamic Breakdown auto-calculated from live response
  const breakdown = useMemo(() => {
    const rawCounts = reviewsData?.ratingBreakdown || { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    const total = totalCount || 1;
    return [5, 4, 3, 2, 1].map((stars) => {
      const count = (rawCounts as any)[stars] || 0;
      const pct = totalCount > 0 ? Math.round((count / total) * 100) : 0;
      return { stars, pct, count };
    });
  }, [reviewsData?.ratingBreakdown, totalCount]);

  // Dynamic Recommendation Percentage
  const recommendPct = useMemo(() => {
    if (totalCount === 0) return 100;
    const positiveCount = reviews.filter((r) => r.rating >= 4).length;
    return Math.round((positiveCount / totalCount) * 100);
  }, [reviews, totalCount]);

  const [isWriteOpen, setIsWriteOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');

  const userDisplayName = user
    ? [user.firstName, user.lastName].filter(Boolean).join(' ') || user.email.split('@')[0]
    : '';

  // Set user name if authenticated
  useEffect(() => {
    if (userDisplayName && !name) {
      setName(userDisplayName);
    }
  }, [userDisplayName]);

  // Filters & Sorting
  const [starFilter, setStarFilter] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<'recent' | 'highest'>('recent');

  // Interactive helpful counts per review
  const [helpfulMap, setHelpfulMap] = useState<Record<string, number>>({});
  const [votedMap, setVotedMap] = useState<Record<string, boolean>>({});

  const filteredReviews = useMemo(() => {
    let list = [...reviews];
    if (starFilter !== null) {
      list = list.filter((r) => Math.round(r.rating) === starFilter);
    }
    if (sortBy === 'highest') {
      list.sort((a, b) => b.rating - a.rating);
    } else {
      list.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }
    return list;
  }, [reviews, starFilter, sortBy]);

  const handleToggleWriteReview = () => {
    if (!isAuthenticated) {
      showToast('Please sign in to write a customer review', 'info');
      openAuthModal('login');
      return;
    }
    setIsWriteOpen(!isWriteOpen);
  };

  const handleHelpfulClick = (reviewId: string) => {
    const hasVoted = votedMap[reviewId];
    if (hasVoted) {
      setHelpfulMap((prev) => ({
        ...prev,
        [reviewId]: Math.max(0, (prev[reviewId] || 1) - 1),
      }));
      setVotedMap((prev) => ({
        ...prev,
        [reviewId]: false,
      }));
      showToast('Removed your helpful vote');
    } else {
      setHelpfulMap((prev) => ({
        ...prev,
        [reviewId]: (prev[reviewId] || 0) + 1,
      }));
      setVotedMap((prev) => ({
        ...prev,
        [reviewId]: true,
      }));
      showToast('Marked as helpful!');
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      showToast('Please sign in to submit a review', 'info');
      openAuthModal('login');
      return;
    }
    if (!comment.trim()) {
      showToast('Please enter your review comment', 'info');
      return;
    }

    try {
      await submitReviewMutation.mutateAsync({
        productId,
        rating,
        title: title.trim() || 'Customer Review',
        comment: comment.trim(),
        customerName: name.trim() || userDisplayName || undefined,
      });

      showToast('Thank you! Your review has been submitted.', 'success');
      setIsWriteOpen(false);
      setTitle('');
      setComment('');
      setRating(5);
    } catch (err: any) {
      showToast(err?.message || 'Failed to submit review. Please try again.', 'error');
    }
  };

  const getRatingLabel = (r: number) => {
    switch (r) {
      case 5:
        return 'Excellent';
      case 4:
        return 'Good';
      case 3:
        return 'Average';
      case 2:
        return 'Below Average';
      default:
        return 'Poor';
    }
  };

  return (
    <section className="mt-20 pt-16 border-t border-neutral-200">
      <div className="space-y-8">
        {/* Section Heading */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-[11px] font-black uppercase tracking-[0.25em] text-rose-600">
              COMMUNITY FEEDBACK
            </span>
            <div className="flex items-center gap-3 mt-1">
              <h3 className="text-2xl sm:text-3xl font-semibold uppercase tracking-tight text-neutral-950">
                Customer Reviews
              </h3>
              <span className="bg-neutral-100 text-neutral-800 text-xs font-bold px-2.5 py-1 rounded-full border border-neutral-200">
                {totalCount}
              </span>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleToggleWriteReview}
            className="self-start sm:self-auto gap-2 rounded-xl h-11 px-4 font-bold border-neutral-300 hover:border-black transition-all shadow-xs"
          >
            <MessageSquarePlus className="w-4 h-4" />
            <span>{isWriteOpen ? 'Cancel Review' : 'Write a Review'}</span>
          </Button>
        </div>

        {/* Rating Breakdown Hero Hub */}
        <div className="rounded-2xl bg-gradient-to-b from-neutral-50/80 via-white to-neutral-50/50 border border-neutral-200/90 p-6 sm:p-8 shadow-xs">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Left: Overall Score */}
            <div className="md:col-span-4 flex flex-col justify-center items-center text-center md:border-r md:border-neutral-200/80 md:pr-8 space-y-2">
              <div className="flex items-baseline gap-1">
                <span className="text-5xl sm:text-6xl font-semibold text-neutral-950 tracking-tight leading-none">
                  {totalCount > 0 ? avgRating : '0.0'}
                </span>
                <span className="text-neutral-400 text-lg font-medium">/ 5.0</span>
              </div>

              <div className="flex items-center gap-1 text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      totalCount > 0 && i < Math.round(Number(avgRating))
                        ? 'fill-amber-400 text-amber-400'
                        : 'fill-neutral-100 text-neutral-200'
                    }`}
                  />
                ))}
              </div>

              <span className="text-xs text-neutral-500 font-medium">
                {totalCount > 0
                  ? `Based on ${totalCount} genuine customer review${totalCount > 1 ? 's' : ''}`
                  : 'Be the first to leave a review'}
              </span>

              {totalCount > 0 && (
                <div className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200/80 px-3 py-1 rounded-full text-xs font-bold text-emerald-800 mt-1 shadow-2xs">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{recommendPct}% recommend this product</span>
                </div>
              )}
            </div>

            {/* Right: Dynamic Star Percentage Bars */}
            <div className="md:col-span-8 flex flex-col justify-center space-y-2.5">
              {breakdown.map((b) => {
                const isSelected = starFilter === b.stars;
                return (
                  <button
                    key={b.stars}
                    type="button"
                    onClick={() => setStarFilter(isSelected ? null : b.stars)}
                    className={`flex items-center gap-3 text-xs w-full rounded-lg px-2.5 py-1.5 transition-all cursor-pointer select-none ${
                      isSelected
                        ? 'bg-neutral-900 text-white shadow-xs'
                        : 'hover:bg-neutral-100/80 text-neutral-700'
                    }`}
                    title={`Filter by ${b.stars} stars`}
                  >
                    <span className="w-14 text-left font-bold flex items-center gap-1 shrink-0">
                      <span>{b.stars}</span>
                      <Star
                        className={`w-3.5 h-3.5 ${
                          isSelected
                            ? 'fill-amber-300 text-amber-300'
                            : 'fill-amber-400 text-amber-400'
                        }`}
                      />
                    </span>

                    <div className="flex-1 h-2.5 bg-neutral-200/90 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isSelected ? 'bg-amber-400' : 'bg-neutral-900'
                        }`}
                        style={{ width: `${b.pct}%` }}
                      />
                    </div>

                    <span
                      className={`w-14 text-right font-medium shrink-0 ${
                        isSelected ? 'text-neutral-200' : 'text-neutral-500'
                      }`}
                    >
                      {b.count} ({b.pct}%)
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Filter & Sort Action Toolbar */}
        {totalCount > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            {/* Quick Rating Filter Pills */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => setStarFilter(null)}
                className={`text-xs font-bold px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                  starFilter === null
                    ? 'bg-neutral-950 text-white border-neutral-950 shadow-xs'
                    : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-400'
                }`}
              >
                All Reviews ({totalCount})
              </button>
              {[5, 4, 3, 2, 1].map((st) => {
                const countForStar = breakdown.find((b) => b.stars === st)?.count || 0;
                if (countForStar === 0 && starFilter !== st) return null;

                return (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setStarFilter(starFilter === st ? null : st)}
                    className={`text-xs font-bold px-3 py-1.5 rounded-full border transition-all cursor-pointer flex items-center gap-1 ${
                      starFilter === st
                        ? 'bg-neutral-950 text-white border-neutral-950 shadow-xs'
                        : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-400'
                    }`}
                  >
                    <span>{st} Stars ({countForStar})</span>
                    <Star
                      className={`w-3 h-3 ${
                        starFilter === st
                          ? 'fill-amber-300 text-amber-300'
                          : 'fill-amber-400 text-amber-400'
                      }`}
                    />
                  </button>
                );
              })}
              {starFilter !== null && (
                <button
                  type="button"
                  onClick={() => setStarFilter(null)}
                  className="text-xs font-semibold text-rose-600 hover:underline px-1 cursor-pointer"
                >
                  Clear Filter
                </button>
              )}
            </div>

            {/* Sort Selector */}
            <div className="flex items-center gap-2 text-xs font-semibold text-neutral-600 ml-auto">
              <span>Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-white border border-neutral-200 rounded-lg px-2.5 py-1 text-xs font-bold text-neutral-900 focus:outline-none focus:border-black cursor-pointer shadow-2xs"
              >
                <option value="recent">Most Recent</option>
                <option value="highest">Highest Rating</option>
              </select>
            </div>
          </div>
        )}

        {/* Write Review Form Modal / Box */}
        {isWriteOpen && (
          <form
            onSubmit={handleSubmitReview}
            className="p-6 sm:p-8 bg-white border border-neutral-300 rounded-2xl space-y-5 shadow-lg animate-in fade-in duration-200"
          >
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
              <div>
                <h4 className="text-base font-extrabold uppercase tracking-wide text-neutral-900">
                  Write a Review
                </h4>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Share your experience with "{productName}"
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsWriteOpen(false)}
                className="text-neutral-400 hover:text-black p-1.5 rounded-full hover:bg-neutral-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Star Picker */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-700 block">
                Overall Rating
              </label>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-neutral-300">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 focus:outline-none transition-transform hover:scale-110 cursor-pointer"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          star <= (hoverRating || rating)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-neutral-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <span className="text-xs font-bold text-neutral-700 ml-2">
                  {getRatingLabel(hoverRating || rating)}
                </span>
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-700 block mb-1">
                Headline / Title
              </label>
              <Input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Best boxy heavyweight tee I own"
                maxLength={80}
              />
            </div>

            {/* Comment */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-700 block mb-1">
                Review Comment *
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Describe the fit, fabric weight (GSM), print quality, drape, and overall feel..."
                rows={4}
                required
                className="w-full rounded-xl border border-neutral-300 p-3 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
              />
            </div>

            {/* Name */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-700 block mb-1">
                Your Display Name
              </label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={userDisplayName || 'e.g. Sachin K.'}
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={() => setIsWriteOpen(false)}
                className="rounded-xl"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={submitReviewMutation.isPending}
                className="rounded-xl font-bold min-w-[140px]"
              >
                {submitReviewMutation.isPending ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Submitting...</span>
                  </span>
                ) : (
                  'Submit Review'
                )}
              </Button>
            </div>
          </form>
        )}

        {/* Reviews Cards Grid (3 Columns) */}
        <div>
          {isLoading && reviews.length === 0 ? (
            <div className="py-16 flex items-center justify-center text-neutral-400 gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-black" />
              <span className="text-sm font-semibold uppercase tracking-wider">Loading reviews...</span>
            </div>
          ) : filteredReviews.length === 0 ? (
            <div className="text-center py-14 bg-neutral-50 rounded-2xl border border-neutral-200/80 space-y-3">
              <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mx-auto text-neutral-400">
                <Star className="w-5 h-5" />
              </div>
              <p className="text-sm font-bold text-neutral-900">
                {starFilter !== null
                  ? `No reviews found for ${starFilter} star filter`
                  : 'No customer reviews yet for this product'}
              </p>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                {starFilter !== null
                  ? 'Try selecting a different rating or viewing all reviews.'
                  : `Be the first to share your thoughts and help others decide.`}
              </p>
              <div className="pt-2">
                {starFilter !== null ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setStarFilter(null)}
                    className="rounded-xl font-bold"
                  >
                    View all reviews
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleToggleWriteReview}
                    className="rounded-xl font-bold"
                  >
                    Write the First Review
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredReviews.map((rev) => {
                const initial = rev.customerName?.charAt(0)?.toUpperCase() || 'U';
                const currentHelpful = helpfulMap[rev.id] || 0;
                const hasVoted = votedMap[rev.id];

                return (
                  <div
                    key={rev.id}
                    className="rounded-2xl border border-neutral-200/90 bg-white p-5 sm:p-6 shadow-2xs hover:border-neutral-300 hover:shadow-xs transition-all flex flex-col justify-between gap-4"
                  >
                    <div className="space-y-3">
                      {/* Card Header */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-neutral-900 to-neutral-700 text-white font-black text-xs flex items-center justify-center shadow-2xs shrink-0">
                            {initial}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-neutral-950 truncate">
                              {rev.customerName}
                            </p>
                            <p className="text-[11px] text-neutral-400 font-medium">
                              {formatDate(rev.createdAt)}
                            </p>
                          </div>
                        </div>

                        {/* Star Rating */}
                        <div className="flex items-center gap-0.5 text-amber-400 bg-amber-50/70 border border-amber-200/60 px-2 py-0.5 rounded-full shrink-0">
                          {Array.from({ length: Math.round(rev.rating) }).map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                      </div>

                      {/* Review Headline */}
                      {rev.title && (
                        <h4 className="text-sm font-bold text-neutral-900 leading-snug line-clamp-2">
                          {rev.title}
                        </h4>
                      )}

                      {/* Review Comment */}
                      <p className="text-xs sm:text-[13px] text-neutral-700 leading-relaxed font-normal">
                        {rev.comment}
                      </p>
                    </div>

                    {/* Card Footer */}
                    <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
                      <button
                        type="button"
                        onClick={() => handleHelpfulClick(rev.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border text-xs font-semibold transition-all cursor-pointer active:scale-95 ${
                          hasVoted
                            ? 'bg-neutral-900 text-white border-neutral-900 shadow-2xs'
                            : 'bg-neutral-50 border-neutral-200 text-neutral-700 hover:bg-neutral-100 hover:border-neutral-300'
                        }`}
                        title={hasVoted ? 'Click to remove helpful vote' : 'Mark as helpful'}
                      >
                        <ThumbsUp className={`w-3.5 h-3.5 ${hasVoted ? 'fill-current' : ''}`} />
                        <span>Helpful ({currentHelpful})</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default ProductReviewsSection;

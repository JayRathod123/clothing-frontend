import React from 'react';
import { Button } from '@/components/ui/Button';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
}

export function EmptyState({
  title = 'No pieces found.',
  description = 'Try adjusting your filters or search keywords.',
  actionText = 'CLEAR ALL FILTERS',
  onAction,
}: EmptyStateProps) {
  return (
    <div className="py-20 text-center max-w-md mx-auto px-4 space-y-4">
      <div className="w-12 h-12 mx-auto border border-[#E6E3DD] rounded-full flex items-center justify-center text-[#929292]">
        —
      </div>
      <div className="space-y-1">
        <h3 className="text-sm uppercase tracking-widest font-semibold text-[#171717]">
          {title}
        </h3>
        <p className="text-xs text-[#686868] leading-relaxed">
          {description}
        </p>
      </div>
      {onAction && actionText ? (
        <div className="pt-2">
          <Button variant="outline" size="sm" onClick={onAction}>
            {actionText}
          </Button>
        </div>
      ) : null}
    </div>
  );
}

export function ErrorState({
  title = 'Something went wrong.',
  description = 'We encountered an error loading this information. Please try again.',
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="py-20 text-center max-w-md mx-auto px-4 space-y-4">
      <div className="space-y-1">
        <h3 className="text-sm uppercase tracking-widest font-semibold text-[#171717]">
          {title}
        </h3>
        <p className="text-xs text-[#686868] leading-relaxed">
          {description}
        </p>
      </div>
      {onRetry ? (
        <div className="pt-2">
          <Button variant="primary" size="sm" onClick={onRetry}>
            TRY AGAIN
          </Button>
        </div>
      ) : null}
    </div>
  );
}

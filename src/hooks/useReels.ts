import { useQuery } from '@tanstack/react-query';
import { reelService, Reel } from '@/services/reel.service';

export function useReels() {
  return useQuery<Reel[]>({
    queryKey: ['reels'],
    queryFn: () => reelService.getActiveReels(),
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });
}

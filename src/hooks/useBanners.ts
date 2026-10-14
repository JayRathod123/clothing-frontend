import { useQuery } from '@tanstack/react-query';
import { bannerService, Banner } from '@/services/banner.service';

export function useBanners(position: string = 'homepage_hero') {
  return useQuery<Banner[]>({
    queryKey: ['banners', position],
    queryFn: () => bannerService.getActiveBanners(position),
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });
}

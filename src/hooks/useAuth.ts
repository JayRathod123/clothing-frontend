import React, { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '@/services/auth.service';
import { LoginDto, RegisterDto } from '@/types/auth.types';

export function useAuth() {
  const queryClient = useQueryClient();

  // Listen for session expiry event dispatched by axios interceptor
  useEffect(() => {
    const handleExpired = () => {
      queryClient.setQueryData(['auth', 'user'], null);
      queryClient.invalidateQueries({ queryKey: ['auth'] });
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('auth:expired', handleExpired);
      return () => window.removeEventListener('auth:expired', handleExpired);
    }
  }, [queryClient]);

  const userQuery = useQuery({
    queryKey: ['auth', 'user'],
    queryFn: () => authService.getProfile(),
  });

  const loginMutation = useMutation({
    mutationFn: (dto: LoginDto) => authService.login(dto),
    onSuccess: (user) => {
      queryClient.setQueryData(['auth', 'user'], user);
      queryClient.invalidateQueries({ queryKey: ['auth'] });
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    },
  });

  const registerMutation = useMutation({
    mutationFn: (dto: RegisterDto) => authService.register(dto),
    onSuccess: (user) => {
      queryClient.setQueryData(['auth', 'user'], user);
      queryClient.invalidateQueries({ queryKey: ['auth'] });
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      queryClient.setQueryData(['auth', 'user'], null);
      queryClient.invalidateQueries({ queryKey: ['auth'] });
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    },
  });

  return {
    user: userQuery.data,
    isLoading: userQuery.isLoading,
    isAuthenticated: Boolean(userQuery.data),
    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    register: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    logout: logoutMutation.mutateAsync,
    isLoggingOut: logoutMutation.isPending,
  };
}

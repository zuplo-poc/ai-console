import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Refetch on reconnect
      refetchOnReconnect: true,
      // Retry failed requests 3 times
      retry: 3,
      // Stale time - data is considered fresh for 5 minutes
      staleTime: 5 * 60 * 1000,
      // Cache time - keep data in cache for 10 minutes
      gcTime: 10 * 60 * 1000,
      // Refetch when window becomes visible
      refetchOnMount: true,
      // Refetch when component becomes visible - always refetch
      refetchOnWindowFocus: 'always',
    },
    mutations: {
      // Retry failed mutations once
      retry: 1,
    },
  },
}); 
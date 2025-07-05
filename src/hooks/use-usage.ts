import { useQuery } from '@tanstack/react-query';
import { apiService } from '@/lib/api';

// Query keys
export const usageKeys = {
  all: ['usage'] as const,
  modelUsage: (subject: string, timeRange: string) => 
    [...usageKeys.all, 'model', subject, timeRange] as const,
  usage: (subject: string, metric: string, timeRange: string, windowSize: string) => 
    [...usageKeys.all, 'data', subject, metric, timeRange, windowSize] as const,
};

// Hook to fetch model usage data
export function useModelUsageData(subject: string, timeRange: string = '30d') {
  return useQuery({
    queryKey: usageKeys.modelUsage(subject, timeRange),
    queryFn: () => apiService.getModelUsageData(subject, timeRange),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!subject, // Only run query if subject is provided
    refetchOnWindowFocus: 'always', // Always refetch when window gains focus
  });
}

// Hook to fetch usage data
export function useUsageData(
  subject: string, 
  metric: string = 'tokens_total', 
  timeRange: string = '30d', 
  windowSize: string = 'DAY'
) {
  return useQuery({
    queryKey: usageKeys.usage(subject, metric, timeRange, windowSize),
    queryFn: () => apiService.getUsageData(subject, metric, timeRange, windowSize),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!subject, // Only run query if subject is provided
    refetchOnWindowFocus: 'always', // Always refetch when window gains focus
  });
} 
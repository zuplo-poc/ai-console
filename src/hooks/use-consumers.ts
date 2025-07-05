import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService, ConsumerCreateRequest, ConsumerUpdateRequest } from '@/lib/api';
import { Consumer } from '@/lib/types';
import { toast } from 'sonner';

// Query keys
export const consumerKeys = {
  all: ['consumers'] as const,
  lists: () => [...consumerKeys.all, 'list'] as const,
  list: (filters: string) => [...consumerKeys.lists(), { filters }] as const,
  details: () => [...consumerKeys.all, 'detail'] as const,
  detail: (id: string) => [...consumerKeys.details(), id] as const,
};

// Hook to fetch all consumers
export function useConsumers() {
  return useQuery({
    queryKey: consumerKeys.lists(),
    queryFn: () => apiService.getAllConsumers(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: 'always', // Always refetch when window gains focus
  });
}

// Hook to create a consumer
export function useCreateConsumer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ConsumerCreateRequest) => apiService.createConsumer(data),
    onSuccess: (result) => {
      // Invalidate and refetch consumers list
      queryClient.invalidateQueries({ queryKey: consumerKeys.lists() });
      
      // Add the new consumer to the cache
      queryClient.setQueryData(consumerKeys.lists(), (oldData: Consumer[] | undefined) => {
        if (oldData) {
          return [...oldData, result.consumer];
        }
        return [result.consumer];
      });

      toast.success('Consumer created successfully');
    },
    onError: (error) => {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create consumer';
      toast.error(errorMessage);
    },
  });
}

// Hook to update a consumer
export function useUpdateConsumer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ConsumerUpdateRequest }) =>
      apiService.updateConsumer(id, data),
    onSuccess: (updatedConsumer) => {
      // Invalidate and refetch consumers list
      queryClient.invalidateQueries({ queryKey: consumerKeys.lists() });
      
      // Update the consumer in the cache
      queryClient.setQueryData(consumerKeys.lists(), (oldData: Consumer[] | undefined) => {
        if (oldData) {
          return oldData.map((consumer) =>
            consumer.id === updatedConsumer.id ? updatedConsumer : consumer
          );
        }
        return oldData;
      });

      toast.success('Consumer updated successfully');
    },
    onError: (error) => {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update consumer';
      toast.error(errorMessage);
    },
  });
}

// Hook to delete a consumer
export function useDeleteConsumer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      apiService.deleteConsumer(id, name),
    onSuccess: (_, { id }) => {
      // Invalidate and refetch consumers list
      queryClient.invalidateQueries({ queryKey: consumerKeys.lists() });
      
      // Remove the consumer from the cache
      queryClient.setQueryData(consumerKeys.lists(), (oldData: Consumer[] | undefined) => {
        if (oldData) {
          return oldData.filter((consumer) => consumer.id !== id);
        }
        return oldData;
      });

      toast.success('Consumer deleted successfully');
    },
    onError: (error) => {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete consumer';
      toast.error(errorMessage);
    },
  });
} 
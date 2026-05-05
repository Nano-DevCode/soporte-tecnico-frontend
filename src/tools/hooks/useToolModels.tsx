import { useMemo } from 'react';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getToolModelsActions } from '../actions/get-toolmodels';
import { createToolModelsActions } from '../actions/create-toolmodels';

export const useToolModels = (searchTerm: string = "", brandId: string = "") => {
  const queryClient = useQueryClient();

  const query = useInfiniteQuery({
    queryKey: ['toolModels', searchTerm, brandId], 
    queryFn: ({ pageParam = 0 }) => 
      getToolModelsActions({ 
        limit: 10, 
        offset: pageParam, 
        query: searchTerm, 
        brandId: brandId ? brandId : undefined
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (lastPage.meta.page >= lastPage.meta.lastPage) return undefined;
      return lastPage.meta.page * 10;
    },
    staleTime: 1000 * 60 * 5,
  });

  const createMutation = useMutation({
    mutationFn: createToolModelsActions,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['toolModels'] });
    },
  });

  const memorizedToolModels = useMemo(() => {
    return query.data?.pages.flatMap((page) => page.models) ?? [];
  }, [query.data]); 

  return {
    // Lectura
    toolModels: memorizedToolModels, 
    meta: query.data?.pages.at(-1)?.meta,
    fetchNextPage: query.fetchNextPage,
    hasNextPage: query.hasNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
    isLoading: query.isLoading,
    
    // Escritura
    createModel: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    createError: createMutation.error,
  };
};
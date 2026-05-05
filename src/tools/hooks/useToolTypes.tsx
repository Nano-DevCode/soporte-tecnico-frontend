import { useMemo } from 'react';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getToolTypesActions } from '../actions/get-tooltypes';
import { createToolTypesActions } from '../actions/create-tooltypes';

export const useToolTypes = (searchTerm: string = "") => {
  const queryClient = useQueryClient();

  const query = useInfiniteQuery({
    queryKey: ['toolTypes', searchTerm], 
    queryFn: ({ pageParam = 0 }) => 
      getToolTypesActions({ 
        limit: 10, 
        offset: pageParam, 
        query: searchTerm, 
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (lastPage.meta.page >= lastPage.meta.lastPage) return undefined;
      return lastPage.meta.page * 10;
    },
    staleTime: 1000 * 60 * 5,
  });

  const createMutation = useMutation({
    mutationFn: createToolTypesActions,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['toolTypes'] });
    },
  });

  const memorizedToolModels = useMemo(() => {
    return query.data?.pages.flatMap((page) => page.types) ?? [];
  }, [query.data]); 

  return {
    // Lectura
    toolTypes: memorizedToolModels, 
    meta: query.data?.pages.at(-1)?.meta,
    fetchNextPage: query.fetchNextPage,
    hasNextPage: query.hasNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
    isLoading: query.isLoading,
    
    // Escritura
    createType: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    createError: createMutation.error,
  };
};
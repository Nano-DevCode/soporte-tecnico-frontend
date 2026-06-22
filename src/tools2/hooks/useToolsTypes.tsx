import { useMemo } from 'react';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getToolsTypesAction } from '../actions/get-tools-types';
import { createToolsTypeAction } from '../actions/create-tools-type';

export const useToolsTypes = (searchTerm: string = "") => {
  const queryClient = useQueryClient();

  const {
    data: queryData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error
  } = useInfiniteQuery({
    queryKey: ['toolsTypes', searchTerm],
    queryFn: ({ pageParam = 0 }) => 
      getToolsTypesAction({ 
        limit: 10, 
        offset: pageParam, 
        query: searchTerm 
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (lastPage.meta.page >= lastPage.meta.lastPage) return undefined;
      return lastPage.meta.page * 10;
    },
    staleTime: 1000 * 60 * 5, 
  });

  const createMutation = useMutation({
    mutationFn: createToolsTypeAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['toolsTypes'] });
    },
  });

  const memorizedToolsTypes = useMemo(() => {
    return queryData?.pages.flatMap((page) => page.toolsTypes) ?? [];
  }, [queryData]); // <-- Ahora escucha únicamente a queryData

  return {
    toolsTypes: memorizedToolsTypes, 
    meta: queryData?.pages.at(-1)?.meta,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    
    createType: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    createError: createMutation.error,
  };
};
import { useMemo } from 'react';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getItAssetsTypesAction } from '../actions/get-itAssets-types';
import { createItAssetsTypeAction } from '../actions/create-itAssets-type';

export const useItAssetsTypes = (searchTerm: string = "") => {
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
    queryKey: ['itAssetsTypes', searchTerm],
    queryFn: ({ pageParam = 0 }) => 
      getItAssetsTypesAction({ 
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
    mutationFn: createItAssetsTypeAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['itAssetsTypes'] });
    },
  });

  const memorizedItAssetsTypes = useMemo(() => {
    return queryData?.pages.flatMap((page) => page.itAssetsTypes) ?? [];
  }, [queryData]); // <-- Ahora escucha únicamente a queryData

  return {
    itAssetsTypes: memorizedItAssetsTypes, 
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
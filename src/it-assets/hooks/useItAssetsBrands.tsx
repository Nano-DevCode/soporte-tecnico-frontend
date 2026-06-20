import { useMemo } from 'react';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getItAssetsBrandsAction } from '../actions/get-itAssets-brands';
import { createItAssetsBrandAction } from '../actions/create-itAssets-brand';

export const useItAssetsBrands = (searchTerm: string = "") => {
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
    queryKey: ['itAssetsBrands', searchTerm],
    queryFn: ({ pageParam = 0 }) => 
      getItAssetsBrandsAction({ 
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
    mutationFn: createItAssetsBrandAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['itAssetsBrands'] });
    },
  });

  const memorizedItAssetsBrands = useMemo(() => {
    return queryData?.pages.flatMap((page) => page.itAssetsBrands) ?? [];
  }, [queryData]); 

  return {
    itAssetsBrands: memorizedItAssetsBrands, 
    meta: queryData?.pages.at(-1)?.meta,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    
    createBrand: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    createError: createMutation.error,
  };
};
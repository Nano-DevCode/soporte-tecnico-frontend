import { useMemo } from 'react';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getToolsBrandsAction } from '../actions/get-tools-brands';
import { createToolsBrandAction } from '../actions/create-tools-brand';

export const useToolsBrands = (searchTerm: string = "") => {
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
    queryKey: ['toolsBrands', searchTerm],
    queryFn: ({ pageParam = 0 }) => 
      getToolsBrandsAction({ 
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
    mutationFn: createToolsBrandAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['toolsBrands'] });
    },
  });

  const memorizedToolsBrands = useMemo(() => {
    return queryData?.pages.flatMap((page) => page.toolsBrands) ?? [];
  }, [queryData]); 

  return {
    toolsBrands: memorizedToolsBrands, 
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
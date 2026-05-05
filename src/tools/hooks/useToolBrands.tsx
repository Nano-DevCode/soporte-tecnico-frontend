import { useMemo } from 'react'; // 👈 1. Lo importas de React
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getToolBrandsActions } from "../actions/get-toolbrands";
import { createToolBrandsActions } from "../actions/create-toolbrands";

export const useToolBrands = (searchTerm: string = "") => {
  const queryClient = useQueryClient();

  const query = useInfiniteQuery({
    queryKey: ['toolBrands', searchTerm],
    queryFn: ({ pageParam = 0 }) => 
      getToolBrandsActions({ 
        limit: 10, 
        offset: pageParam, 
        query: searchTerm }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (lastPage.meta.page >= lastPage.meta.lastPage) return undefined;
      return lastPage.meta.page * 10;
    },
    staleTime: 1000 * 60 * 5,
  });

  const createMutation = useMutation({
    mutationFn: createToolBrandsActions,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['toolBrands'] });
    },
  });

  const memorizedToolBrands = useMemo(() => {
    return query.data?.pages.flatMap((page) => page.brands) ?? [];
  }, [query.data]); 

  return {
    // Datos de lectura
    toolBrands: memorizedToolBrands, 
    meta: query.data?.pages.at(-1)?.meta,
    fetchNextPage: query.fetchNextPage,
    hasNextPage: query.hasNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    
    // Datos de escritura
    createBrand: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    createError: createMutation.error,
  };
};
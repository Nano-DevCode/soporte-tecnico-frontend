import { useMemo } from 'react';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getItAssetsInvoicesAction } from '../actions/get-itAssets-invoices';
import { createItAssetsInvoiceAction } from '../actions/create-itAssets-invoice';

export const useItAssetsInvoices = (searchTerm: string = "") => {
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
    queryKey: ['itAssetsInvoices', searchTerm],
    queryFn: ({ pageParam = 0 }) => 
      getItAssetsInvoicesAction({ 
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
    mutationFn: createItAssetsInvoiceAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['itAssetsInvoices'] });
    },
  });

  const memorizedItAssetsInvoices = useMemo(() => {
    return queryData?.pages.flatMap((page) => page.itAssetsInvoices) ?? [];
  }, [queryData]); 

  return {
    itAssetsInvoices: memorizedItAssetsInvoices, 
    meta: queryData?.pages.at(-1)?.meta,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    
    createInvoice: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    createError: createMutation.error,
  };
};
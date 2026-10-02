import { useMemo } from 'react';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getToolsInvoicesAction } from '../actions/get-tools-invoices';
import { createToolsInvoiceAction } from '../actions/create-tools-invoice';

export const useToolsInvoices = (searchTerm: string = "") => {
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
    queryKey: ['toolsInvoices', searchTerm],
    queryFn: ({ pageParam = 0 }) => 
      getToolsInvoicesAction({ 
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
    mutationFn: createToolsInvoiceAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['toolsInvoices'] });
    },
  });

  const memorizedToolsInvoices = useMemo(() => {
    return queryData?.pages.flatMap((page) => page.toolsInvoices) ?? [];
  }, [queryData]); 

  return {
    toolsInvoices: memorizedToolsInvoices, 
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
import { useMemo } from 'react';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getItAssetsInvoicesAction } from '../actions/get-itAssets-invoices';
import { createItAssetsInvoiceAction } from '../actions/create-itAssets-invoice';

export const useItAssetsInvoices = (searchTerm: string = "") => {
  const queryClient = useQueryClient();

  const query = useInfiniteQuery({
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
    // IMPORTANTE: Aquí asumo que tu interfaz ItAssetsInvoicesResponse tiene un arreglo llamado "invoices".
    // Si se llama distinto (ej. "data", "items" o "facturas"), solo cambia "page.invoices" por ese nombre.
    return query.data?.pages.flatMap((page) => page.itAssetsInvoices) ?? [];
  }, [query.data]); 

  return {
    itAssetsInvoices: memorizedItAssetsInvoices, 
    meta: query.data?.pages.at(-1)?.meta,
    fetchNextPage: query.fetchNextPage,
    hasNextPage: query.hasNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    
    createInvoice: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    createError: createMutation.error,
  };
};
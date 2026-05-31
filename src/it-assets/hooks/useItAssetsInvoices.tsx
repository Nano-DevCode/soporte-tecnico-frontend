import { useMemo } from 'react';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getItAssetsInvoicesAction } from '../actions/get-itAssets-invoices';
import { createItAssetsInvoiceAction } from '../actions/create-itAssets-invoice';

export const useItAssetsInvoices = (searchTerm: string = "") => {
  const queryClient = useQueryClient();

  // 1. Configuración del Infinite Query para lectura y paginación
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
      // Calculamos el siguiente offset basado en la estructura de tu meta
      if (lastPage.meta.page >= lastPage.meta.lastPage) return undefined;
      return lastPage.meta.page * 10;
    },
    staleTime: 1000 * 60 * 5, // 5 minutos de caché
  });

  // 2. Configuración de la Mutación para creación
  const createMutation = useMutation({
    mutationFn: createItAssetsInvoiceAction,
    onSuccess: () => {
      // Invalida la caché para forzar una recarga y mostrar la nueva factura
      queryClient.invalidateQueries({ queryKey: ['itAssetsInvoices'] });
    },
  });

  // 3. Aplanamos las páginas para obtener un solo arreglo continuo
  const memorizedItAssetsInvoices = useMemo(() => {
    // IMPORTANTE: Aquí asumo que tu interfaz ItAssetsInvoicesResponse tiene un arreglo llamado "invoices".
    // Si se llama distinto (ej. "data", "items" o "facturas"), solo cambia "page.invoices" por ese nombre.
    return query.data?.pages.flatMap((page) => page.invoices) ?? [];
  }, [query.data]); 

  return {
    // Datos de lectura
    itAssetsInvoices: memorizedItAssetsInvoices, 
    meta: query.data?.pages.at(-1)?.meta,
    fetchNextPage: query.fetchNextPage,
    hasNextPage: query.hasNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    
    // Datos de escritura
    createInvoice: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    createError: createMutation.error,
  };
};
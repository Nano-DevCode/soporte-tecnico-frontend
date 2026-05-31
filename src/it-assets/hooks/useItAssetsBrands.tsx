import { useMemo } from 'react';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getItAssetsBrandsAction } from '../actions/get-itAssets-brand';
import { createItAssetsBrandAction } from '../actions/create-itAssets-brand';

export const useItAssetsBrands = (searchTerm: string = "") => {
  const queryClient = useQueryClient();

  // 1. Configuración del Infinite Query para lectura y paginación
  const query = useInfiniteQuery({
    queryKey: ['itAssetsBrands', searchTerm],
    queryFn: ({ pageParam = 0 }) => 
      getItAssetsBrandsAction({ 
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
    mutationFn: createItAssetsBrandAction,
    onSuccess: () => {
      // Invalida la caché para forzar una recarga y mostrar la nueva marca creada
      queryClient.invalidateQueries({ queryKey: ['itAssetsBrands'] });
    },
  });

  // 3. Aplanamos las páginas para obtener un solo arreglo continuo
  const memorizedItAssetsBrands = useMemo(() => {
    // IMPORTANTE: Asegúrate de que "brands" coincida con la propiedad de tu interface ItAssetsBrandsResponse
    return query.data?.pages.flatMap((page) => page.brands) ?? [];
  }, [query.data]); 

  return {
    // Datos de lectura
    itAssetsBrands: memorizedItAssetsBrands, 
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
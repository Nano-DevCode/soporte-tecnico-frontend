import { useMemo } from 'react';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getItAssetsModelsAction } from '../actions/get-itAssets-models';
import { createItAssetsModelAction } from '../actions/create-itAssets-model';

// Añadimos modelId como parámetro opcional para soportar el filtro de tu action
export const useItAssetsModels = (searchTerm: string = "", modelId?: string) => {
  const queryClient = useQueryClient();

  // 1. Configuración del Infinite Query
  const query = useInfiniteQuery({
    // La queryKey ahora incluye el modelId para aislar la caché cuando filtres
    queryKey: ['itAssetsModels', searchTerm, modelId],
    queryFn: ({ pageParam = 0 }) => 
      getItAssetsModelsAction({ 
        limit: 10, 
        offset: pageParam, 
        query: searchTerm,
        modelId: modelId // Pasamos el filtro al action
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (lastPage.meta.page >= lastPage.meta.lastPage) return undefined;
      return lastPage.meta.page * 10;
    },
    staleTime: 1000 * 60 * 5, // 5 minutos de caché
  });

  // 2. Configuración de la Mutación para creación
  const createMutation = useMutation({
    mutationFn: createItAssetsModelAction,
    onSuccess: () => {
      // Invalida la caché para recargar la lista de modelos
      queryClient.invalidateQueries({ queryKey: ['itAssetsModels'] });
    },
  });

  // 3. Aplanamos las páginas
  const memorizedItAssetsModels = useMemo(() => {
    // IMPORTANTE: Revisa en tu interfaz ItAssetsModelsResponse si la propiedad se llama "models". 
    // Si se llama "data" o de otra forma, cámbialo aquí.
    return query.data?.pages.flatMap((page) => page.itAssetsModels) ?? [];
  }, [query.data]); 

  return {
    // Datos de lectura
    itAssetsModels: memorizedItAssetsModels, 
    meta: query.data?.pages.at(-1)?.meta,
    fetchNextPage: query.fetchNextPage,
    hasNextPage: query.hasNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    
    // Datos de escritura
    createModel: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    createError: createMutation.error,
  };
};
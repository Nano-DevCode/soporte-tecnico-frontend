import { useMemo } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { getStaffRoleSpecificAction } from '@/it-assets/actions/get-staffRoleSpecific';

export const useStaffRoleSpecific = (searchTerm: string = "") => {
  const query = useInfiniteQuery({
    queryKey: ['staffRoleSpecific', searchTerm],
    // pageParam aquí representa nuestro 'offset'
    queryFn: ({ pageParam = 0 }) => 
      getStaffRoleSpecificAction({ 
        limit: 10, // Puedes ajustar cuántos quieres traer por petición
        offset: pageParam, 
        query: searchTerm 
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      // Calculamos cuál sería el siguiente salto (offset)
      const nextOffset = lastPage.meta.offset + lastPage.meta.limit;
      
      // Si el siguiente salto supera o iguala el total de registros, ya no hay más que cargar
      if (nextOffset >= lastPage.meta.total) return undefined;
      
      return nextOffset;
    },
    staleTime: 1000 * 60 * 5, // 5 minutos de caché
  });

  // Aplanamos todas las páginas devueltas en un solo arreglo continuo
  const memorizedStaffMembers = useMemo(() => {
    return query.data?.pages.flatMap((page) => page.staffs) ?? [];
  }, [query.data]); 

  return {
    // Datos de lectura
    staffMembers: memorizedStaffMembers, 
    meta: query.data?.pages.at(-1)?.meta,
    
    // Controles del Infinite Scroll
    fetchNextPage: query.fetchNextPage,
    hasNextPage: query.hasNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
    
    // Estados generales
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
};
import { useMemo } from 'react';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { getStaffRoleSpecificAction } from '@/users/actions/get-staffRoleSpecific';
import { getStaffByIdAction } from '../actions/get-staff';

export const useStaff = (searchTerm: string = "", id?: string) => {
  const listQuery = useInfiniteQuery({
    queryKey: ['staffList', searchTerm],
    queryFn: ({ pageParam = 0 }) => 
      getStaffRoleSpecificAction({ 
        limit: 10, 
        offset: pageParam, 
        query: searchTerm 
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const nextOffset = lastPage.meta.offset + lastPage.meta.limit;
      if (nextOffset >= lastPage.meta.total) return undefined;
      return nextOffset;
    },
    staleTime: 1000 * 60 * 5, // 5 minutos de caché
  });

  const memorizedStaffMembers = useMemo(() => {
    return listQuery.data?.pages.flatMap((page) => page.staffs) ?? [];
  }, [listQuery.data]); 

  const singleQuery = useQuery({
    queryKey: ['staff', id],
    queryFn: () => getStaffByIdAction(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });

  return {
    // --- Datos de la Lista ---
    staffMembers: memorizedStaffMembers, 
    meta: listQuery.data?.pages.at(-1)?.meta,
    isLoadingList: listQuery.isLoading,
    isErrorList: listQuery.isError,
    errorList: listQuery.error,
    
    // Controles del Infinite Scroll
    fetchNextPage: listQuery.fetchNextPage,
    hasNextPage: listQuery.hasNextPage,
    isFetchingNextPage: listQuery.isFetchingNextPage,
    
    // --- Datos Individuales (Detalles) ---
    staff: singleQuery.data,
    isLoadingStaff: singleQuery.isLoading,
    isFetchingStaff: singleQuery.isFetching,
    errorStaff: singleQuery.error,
  };
};
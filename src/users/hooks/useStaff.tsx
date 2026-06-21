import { useMemo } from 'react';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { getStaffRoleSpecificAction } from '@/users/actions/get-staffRoleSpecific';
import { getStaffByIdAction } from '../actions/get-staff';

export const useStaff = (searchTerm: string = "", id?: string) => {
  const {
    data: listData,
    isLoading: isLoadingList,
    isError: isErrorList,
    error: errorList,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteQuery({
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
    staleTime: 1000 * 60 * 5,
  });

  const memorizedStaffMembers = useMemo(() => {
    return listData?.pages.flatMap((page) => page.staffs) ?? [];
  }, [listData]); 

  const {
    data: staff,
    isLoading: isLoadingStaff,
    isFetching: isFetchingStaff,
    error: errorStaff
  } = useQuery({
    queryKey: ['staff', id],
    queryFn: () => getStaffByIdAction(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });

  return {
    staffMembers: memorizedStaffMembers, 
    meta: listData?.pages.at(-1)?.meta,
    isLoadingList,
    isErrorList,
    errorList,
    
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    
    staff,
    isLoadingStaff,
    isFetchingStaff,
    errorStaff,
  };
};

export default useStaff;
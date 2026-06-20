import { useMemo } from 'react';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getItAssetsModelsAction } from '../actions/get-itAssets-models';
import { createItAssetsModelAction } from '../actions/create-itAssets-model';

export const useItAssetsModels = (searchTerm: string = "", modelId?: string) => {
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
    queryKey: ['itAssetsModels', searchTerm, modelId],
    queryFn: ({ pageParam = 0 }) => 
      getItAssetsModelsAction({ 
        limit: 10, 
        offset: pageParam, 
        query: searchTerm,
        modelId: modelId
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (lastPage.meta.page >= lastPage.meta.lastPage) return undefined;
      return lastPage.meta.page * 10;
    },
    staleTime: 1000 * 60 * 5,
  });

  const createMutation = useMutation({
    mutationFn: createItAssetsModelAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['itAssetsModels'] });
    },
  });

  const memorizedItAssetsModels = useMemo(() => {
    return queryData?.pages.flatMap((page) => page.itAssetsModels) ?? [];
  }, [queryData]); 

  return {
    itAssetsModels: memorizedItAssetsModels, 
    meta: queryData?.pages.at(-1)?.meta,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    
    createModel: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    createError: createMutation.error,
  };
};
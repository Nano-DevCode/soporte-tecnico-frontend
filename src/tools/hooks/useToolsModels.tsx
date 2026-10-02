import { useMemo } from 'react';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getToolsModelsAction } from '../actions/get-tools-models';
import { createToolsModelAction } from '../actions/create-tools-model';

export const useToolsModels = (searchTerm: string = "", modelId?: string) => {
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
    queryKey: ['toolsModels', searchTerm, modelId],
    queryFn: ({ pageParam = 0 }) => 
      getToolsModelsAction({ 
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
    mutationFn: createToolsModelAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['toolsModels'] });
    },
  });

  const memorizedToolsModels = useMemo(() => {
    return queryData?.pages.flatMap((page) => page.toolsModels) ?? [];
  }, [queryData]); 

  return {
    toolsModels: memorizedToolsModels, 
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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useSearchParams } from "react-router";
import { getToolsAction } from "../actions/get-tools";
import { createToolAction } from "../actions/create-tool";
import { getToolAction } from "../actions/get-tool";
import { updateToolAction } from "../actions/update-tool";
import { changeStatusToolAction } from "../actions/changeStatus-tools";


export const useTools = () => {
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();
  
  const { id } = useParams();

  const limit = Number(searchParams.get('limit')) || 10;
  const brandId = searchParams.get('brandId') || undefined;
  const modelId = searchParams.get('modelId') || undefined;
  const typeId = searchParams.get('typeId') || undefined;
  const status = searchParams.get('status') === 'true'
    ? true
    : searchParams.get('status') === 'false'
      ? false
      : undefined;
  const page = Number(searchParams.get('page')) || 1;
  const offset = (page - 1) * limit;
  const query = searchParams.get("query")?.trim() || undefined;

  const {
    data: toolsData,
    isLoading: isLoadingTools,
    isFetching: isFetchingTools,
    error: errorTools,
    refetch
  } = useQuery({
    queryKey: ['tools', { limit, offset, query, brandId, modelId, status, typeId}],
    queryFn: () => getToolsAction({ limit, offset, query, brandId, modelId, status, typeId}),
    staleTime: 1000 * 60 * 5,
    select: (response) => ({
      tools: response.tools ,
      meta: response.meta,
    }),
  });

  const {
    data: toolData,
    isLoading: isLoadingTool,
    isFetching: isFetchingTool,
    error: errorTool
  } = useQuery({
    queryKey: ['tool', id], 
    queryFn: () => getToolAction({ id: id! }), 
    enabled: !!id, 
    staleTime: 1000 * 60 * 5,
  });

  const createToolMutation = useMutation({
    mutationFn: createToolAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tools'] });
    },
  });

  const updateToolsMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) => 
      updateToolAction({ id }, data), 
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tools'] });
      queryClient.invalidateQueries({ queryKey: ['tool', variables.id] });
    },
  });

  const changeStatusMutation = useMutation({
    mutationFn: changeStatusToolAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tools'] });
      if (id) {
        queryClient.invalidateQueries({ queryKey: ['tool', id] });
      }
    },
  });
  
  return {
    tools: toolsData?.tools ?? [],
    meta: toolsData?.meta,
    isLoading: isLoadingTools,
    isFetching: isFetchingTools,
    error: errorTools,
    refetch,
    
    tool: toolData,
    isLoadingTool,
    isFetchingTool,
    errorTool,

    changeStatusAsync: changeStatusMutation.mutateAsync,
    isChangingStatus: changeStatusMutation.isPending,

    createMutation: createToolMutation,
    isCreatingTool: createToolMutation.isPending,

    updateToolsMutation: updateToolsMutation,
    isUpdatingTools: updateToolsMutation.isPending,
  };
};
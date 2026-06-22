import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router"; 
import { createToolsMovementOutAction } from "../actions/create-tools-movement-out";
import { createToolsMovementInAction } from "../actions/create-tools-movement-in";
import { getToolsMovementsAction } from "../actions/get-tools-movements";
import { getToolsMovementAction } from "../actions/get-tool-movement";

export const useToolsMovements = (id?: string) => {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();

  const limit = Number(searchParams.get('limit')) || 10;
  const page = Number(searchParams.get('page')) || 1;
  const offset = (page - 1) * limit;
  
  const query = searchParams.get("query")?.trim() || undefined;
  const type = searchParams.get("type") || undefined;
  const startDate = searchParams.get("startDate") || undefined;
  const endDate = searchParams.get("endDate") || undefined;

  const {
    data: movementsData,
    isLoading: isLoadingMovements,
    isFetching: isFetchingMovements,
    error: errorMovements
  } = useQuery({
    queryKey: ['tools-movements', { limit, offset, query, type, startDate, endDate }],
    queryFn: () => getToolsMovementsAction({ limit, offset, query, type, startDate, endDate }),
    staleTime: 1000 * 60 * 5,
    select: (response) => ({
      toolsMovements: response.toolsMovements,
      meta: response.meta,
    }),
  });

  const {
    data: movementData,
    isLoading: isLoadingMovement,
    isFetching: isFetchingMovement,
    error: errorMovement
  } = useQuery({
    queryKey: ['tools-movement', id],
    queryFn: () => getToolsMovementAction(id!),
    staleTime: 1000 * 60 * 5,
    enabled: !!id, 
  });

  const createMovementOutMutation = useMutation({
    mutationFn: createToolsMovementOutAction, 
    onSuccess: (_ , variables) => {
      queryClient.invalidateQueries({ queryKey: ['tools'] });
      queryClient.invalidateQueries({ queryKey: ['tools-movements'] });
      queryClient.invalidateQueries({ queryKey: ['tool', variables.toolId] });
    },
  });

  const createMovementInMutation = useMutation({
    mutationFn: createToolsMovementInAction, 
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tools'] });
      queryClient.invalidateQueries({ queryKey: ['tools-movements'] });
      queryClient.invalidateQueries({ queryKey: ['tool', variables.toolId] });
    },
  });

  return {
    toolsMovements: movementsData?.toolsMovements ?? [],
    meta: movementsData?.meta,
    isLoadingMovements,
    isFetchingMovements,
    errorMovements,

    toolsMovement: movementData,
    isLoadingMovement,
    isFetchingMovement,
    errorMovement,

    isCreatingOut: createMovementOutMutation.isPending,
    isSuccessOut: createMovementOutMutation.isSuccess,
    errorOut: createMovementOutMutation.error,
    createOutMovementAsync: createMovementOutMutation.mutateAsync,
    createOutMovement: createMovementOutMutation.mutate,   
    
    isCreatingIn: createMovementInMutation.isPending,
    isSuccessIn: createMovementInMutation.isSuccess,
    errorIn: createMovementInMutation.error,
    createInMovementAsync: createMovementInMutation.mutateAsync,
    createInMovement: createMovementInMutation.mutate,   
  };
};
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router"; 
import { createItAssetsMovementOutAction } from "../actions/create-itAssets-movement-out";
import { createItAssetsMovementInAction } from "../actions/create-itAssets-movement-in";
import { getItAssetsMovementsAction } from "../actions/get-itAssets-movements";
import { getItAssetsMovementAction } from "../actions/get-itAsset-movement";

export const useItAssetsMovements = (id?: string) => {
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
    queryKey: ['it-assets-movements', { limit, offset, query, type, startDate, endDate }],
    queryFn: () => getItAssetsMovementsAction({ limit, offset, query, type, startDate, endDate }),
    staleTime: 1000 * 60 * 5,
    select: (response) => ({
      itAssetsMovements: response.itAssetsMovements,
      meta: response.meta,
    }),
  });

  const {
    data: movementData,
    isLoading: isLoadingMovement,
    isFetching: isFetchingMovement,
    error: errorMovement
  } = useQuery({
    queryKey: ['it-assets-movement', id],
    queryFn: () => getItAssetsMovementAction(id!),
    staleTime: 1000 * 60 * 5,
    enabled: !!id, 
  });

  const createMovementOutMutation = useMutation({
    mutationFn: createItAssetsMovementOutAction, 
    onSuccess: (_ , variables) => {
      queryClient.invalidateQueries({ queryKey: ['it-assets'] });
      queryClient.invalidateQueries({ queryKey: ['it-assets-movements'] });
      queryClient.invalidateQueries({ queryKey: ['it-asset', variables.itAssetId] });
    },
  });

  const createMovementInMutation = useMutation({
    mutationFn: createItAssetsMovementInAction, 
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['it-assets'] });
      queryClient.invalidateQueries({ queryKey: ['it-assets-movements'] });
      queryClient.invalidateQueries({ queryKey: ['it-asset', variables.itAssetId] });
    },
  });

  return {
    itAssetsMovements: movementsData?.itAssetsMovements ?? [],
    meta: movementsData?.meta,
    isLoadingMovements,
    isFetchingMovements,
    errorMovements,

    itAssetMovement: movementData,
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
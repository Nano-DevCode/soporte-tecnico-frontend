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

  const queryMovements = useQuery({
    queryKey: ['it-assets-movements', { limit, offset, query }],
    queryFn: () => getItAssetsMovementsAction({ limit, offset, query }),
    staleTime: 1000 * 60 * 5,
    select: (response) => ({
      itAssetsMovements: response.itAssetsMovements,
      meta: response.meta,
    }),
  });

  const queryMovement = useQuery({
    queryKey: ['it-assets-movement', id],
    queryFn: () => getItAssetsMovementAction(id!),
    staleTime: 1000 * 60 * 5,
    enabled: !!id, 
  });

  const createMovementOutMutation = useMutation({
    mutationFn: createItAssetsMovementOutAction, 
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['it-assets'] });
      queryClient.invalidateQueries({ queryKey: ['it-assets-movements'] });
    },
  });

  const createMovementInMutation = useMutation({
    mutationFn: createItAssetsMovementInAction, 
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['it-assets'] });
      queryClient.invalidateQueries({ queryKey: ['it-assets-movements'] });
    },
  });

  return {
    // Datos de la Lista
    itAssetsMovements: queryMovements.data?.itAssetsMovements ?? [],
    meta: queryMovements.data?.meta,
    isLoadingMovements: queryMovements.isLoading,
    isFetchingMovements: queryMovements.isFetching,
    errorMovements: queryMovements.error,

    // Datos para Detalles
    itAssetMovement: queryMovement.data,
    isLoadingMovement: queryMovement.isLoading,
    isFetchingMovement: queryMovement.isFetching,
    errorMovement: queryMovement.error,

    // Crear Salida
    isCreatingOut: createMovementOutMutation.isPending,
    isSuccessOut: createMovementOutMutation.isSuccess,
    errorOut: createMovementOutMutation.error,
    createOutMovementAsync: createMovementOutMutation.mutateAsync,
    createOutMovement: createMovementOutMutation.mutate,  
    
    // Crear Entrada
    isCreatingIn: createMovementInMutation.isPending,
    isSuccessIn: createMovementInMutation.isSuccess,
    errorIn: createMovementInMutation.error,
    createInMovementAsync: createMovementInMutation.mutateAsync,
    createInMovement: createMovementInMutation.mutate,  
  };
};
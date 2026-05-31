import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createItAssetsMovementOutAction } from "../actions/create-itAssets-movement-out";
import { createItAssetsMovementInAction } from "../actions/create-itAssets-movement-in";


export const useItAssetsMovements = () => {
  const queryClient = useQueryClient();

  const createMovementOutMutation = useMutation({
    mutationFn: createItAssetsMovementOutAction, 
    
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['it-assets'] });
    },
  });

  const createMovementInMutation = useMutation({
    mutationFn: createItAssetsMovementInAction, 
    
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['it-assets'] });
    },
  });

  return {
    // Propiedades de estado (útiles para deshabilitar botones o mostrar spinners)
    isCreatingOut: createMovementOutMutation.isPending,
    isSuccessOut: createMovementOutMutation.isSuccess,
    errorOut: createMovementOutMutation.error,

    // Métodos para disparar la petición desde tus componentes
    createOutMovementAsync: createMovementOutMutation.mutateAsync,
    createOutMovement: createMovementOutMutation.mutate,  
    
    isCreatingIn: createMovementInMutation.isPending,
    isSuccessIn: createMovementInMutation.isSuccess,
    errorIn: createMovementInMutation.error,

    createInMovementAsync: createMovementInMutation.mutateAsync,
    createInMovement: createMovementInMutation.mutate,  
  
  };
};
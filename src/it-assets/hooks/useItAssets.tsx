import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router";
import { getItAssetsAction } from "../actions/get-itAssets";
// Importa tu acción para cambiar el estado aquí
// import { changeItAssetStatusAction } from "../actions/changeItAssetStatus"; 

export const useItAssets = () => {
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();

  const limit = Number(searchParams.get('limit')) || 10;
  const page = Number(searchParams.get('page')) || 1;
  const offset = (page - 1) * limit;
  const query = searchParams.get("query")?.trim() || undefined;

  const assetsQuery = useQuery({
    queryKey: ['it-assets', { limit, offset, query }],
    queryFn: () => getItAssetsAction({ limit, offset, query }),
    staleTime: 1000 * 60 * 5,
    select: (response) => ({
      itAssets: response.itAssets,
      meta: response.meta,
    }),
  });

  // Mutación para el cambio de estado rápido (Dar de baja/alta lógica)
  const changeStatusMutation = useMutation({
    mutationFn: async (payload: { id: string; status: boolean }) => {
      // return await changeItAssetStatusAction(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['it-assets'] });
    },
  });

  return {
    itAssets: assetsQuery.data?.itAssets ?? [],
    meta: assetsQuery.data?.meta,
    isLoading: assetsQuery.isLoading,
    isFetching: assetsQuery.isFetching,
    error: assetsQuery.error,
    refetch: assetsQuery.refetch,
    // Agregamos los retornos para la mutación
    changeStatusAsync: changeStatusMutation.mutateAsync,
    isChangingStatus: changeStatusMutation.isPending,
  };
}
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useSearchParams } from "react-router";
import { getItAssetsAction } from "../actions/get-itAssets";
import { getItAssetAction } from "../actions/get-itAsset";
import { createItAssetAction } from "../actions/create-itAsset";

export const useItAssets = () => {
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();
  
  // Desestructuración más limpia
  const { id } = useParams();

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

  const assetQuery = useQuery({
    queryKey: ['it-asset', id], 
    queryFn: () => getItAssetAction({ id: id! }), 
    enabled: !!id, 
    staleTime: 1000 * 60 * 5,
  });

  const createAssetMutation = useMutation({
    mutationFn: createItAssetAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['it-assets'] });
    },
  });

  const changeStatusMutation = useMutation({
    mutationFn: async () => {
    },
    onSuccess: () => {
      // Invalidamos el catálogo general
      queryClient.invalidateQueries({ queryKey: ['it-assets'] });
      // Si estamos viendo un detalle, lo invalidamos también para que se refresque
      if (id) {
        queryClient.invalidateQueries({ queryKey: ['it-asset', id] });
      }
    },
  });
  

  return {
    // Retornos de la lista (Catálogo)
    itAssets: assetsQuery.data?.itAssets ?? [],
    meta: assetsQuery.data?.meta,
    isLoading: assetsQuery.isLoading,
    isFetching: assetsQuery.isFetching,
    error: assetsQuery.error,
    refetch: assetsQuery.refetch,
    
    // CORRECCIÓN 3: Exponemos los retornos del activo individual
    itAsset: assetQuery.data,
    isLoadingAsset: assetQuery.isLoading,
    isFetchingAsset: assetQuery.isFetching,
    errorAsset: assetQuery.error,

    // Mutaciones
    changeStatusAsync: changeStatusMutation.mutateAsync,
    isChangingStatus: changeStatusMutation.isPending,

    createAssetMutation: createAssetMutation,
    isCreatingAsset: createAssetMutation.isPending,
  };
}
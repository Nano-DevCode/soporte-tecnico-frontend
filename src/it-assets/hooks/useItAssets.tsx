import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useSearchParams } from "react-router";
import { getItAssetsAction } from "../actions/get-itAssets";
import { getItAssetAction } from "../actions/get-itAsset";
import { createItAssetAction } from "../actions/create-itAsset";
import { updateItAssetAction } from "../actions/update-itAsset";
import { changeStatusItAssetAction } from "../actions/changeStatus-itAssets";

export const useItAssets = () => {
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();
  
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

  // ==========================================
  // CORRECCIÓN AQUÍ
  // ==========================================
  const updateAssetMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) => 
      updateItAssetAction({ id }, data), 
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['it-assets'] });
      queryClient.invalidateQueries({ queryKey: ['it-asset', variables.id] });
    },
  });

  const changeStatusMutation = useMutation({
    mutationFn: changeStatusItAssetAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['it-assets'] });
      if (id) {
        queryClient.invalidateQueries({ queryKey: ['it-asset', id] });
      }
    },
  });
  
  return {
    itAssets: assetsQuery.data?.itAssets ?? [],
    meta: assetsQuery.data?.meta,
    isLoading: assetsQuery.isLoading,
    isFetching: assetsQuery.isFetching,
    error: assetsQuery.error,
    refetch: assetsQuery.refetch,
    
    itAsset: assetQuery.data,
    isLoadingAsset: assetQuery.isLoading,
    isFetchingAsset: assetQuery.isFetching,
    errorAsset: assetQuery.error,

    changeStatusAsync: changeStatusMutation.mutateAsync,
    isChangingStatus: changeStatusMutation.isPending,

    createAssetMutation: createAssetMutation,
    isCreatingAsset: createAssetMutation.isPending,

    updateAssetMutation: updateAssetMutation,
    isUpdatingAsset: updateAssetMutation.isPending,
  };
}
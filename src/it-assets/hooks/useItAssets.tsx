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
    data: assetsData,
    isLoading: isLoadingAssets,
    isFetching: isFetchingAssets,
    error: errorAssets,
    refetch
  } = useQuery({
    queryKey: ['it-assets', { limit, offset, query, brandId, modelId, status, typeId}],
    queryFn: () => getItAssetsAction({ limit, offset, query, brandId, modelId, status, typeId}),
    staleTime: 1000 * 60 * 5,
    select: (response) => ({
      itAssets: response.itAssets,
      meta: response.meta,
    }),
  });

  const {
    data: assetData,
    isLoading: isLoadingAsset,
    isFetching: isFetchingAsset,
    error: errorAsset
  } = useQuery({
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
    itAssets: assetsData?.itAssets ?? [],
    meta: assetsData?.meta,
    isLoading: isLoadingAssets,
    isFetching: isFetchingAssets,
    error: errorAssets,
    refetch,
    
    itAsset: assetData,
    isLoadingAsset,
    isFetchingAsset,
    errorAsset,

    changeStatusAsync: changeStatusMutation.mutateAsync,
    isChangingStatus: changeStatusMutation.isPending,

    createAssetMutation: createAssetMutation,
    isCreatingAsset: createAssetMutation.isPending,

    updateAssetMutation: updateAssetMutation,
    isUpdatingAsset: updateAssetMutation.isPending,
  };
};
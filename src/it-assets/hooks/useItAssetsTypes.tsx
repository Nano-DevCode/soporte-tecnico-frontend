import { useQuery } from "@tanstack/react-query"
import { getItAssetsTypesAction } from "../actions/get-itAssets-type"
import { useSearchParams} from 'react-router';

export const useItAssetsTypes = () => {
  const [searchParams] = useSearchParams();

  const limit = Number(searchParams.get('limit')) || 10;
  const page = Number(searchParams.get('page')) || 1;
  const offset = (page - 1) * limit;
  const query = searchParams.get("search")?.trim() || undefined;

  const queryItAssetsTypes = useQuery({
    queryKey: ['it-assets-types'],
    queryFn: () => getItAssetsTypesAction({ limit, offset, query }),
    staleTime: 1000 * 60 * 5,
    select: (response) => ({
      itAssetsTypes: response.itAssetsTypes,
    }),
  })

  return {
    itAssetsTypes: queryItAssetsTypes.data?.itAssetsTypes ?? [],
    isLoading: queryItAssetsTypes.isLoading,
    isFetching: queryItAssetsTypes.isFetching,
    error: queryItAssetsTypes.error,
    refetch: queryItAssetsTypes.refetch,
  }
}
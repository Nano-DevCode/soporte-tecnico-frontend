import { useQuery } from "@tanstack/react-query"
import { getItAssetsStatusAction } from "../actions/get-itAssets-status"

const useItAssetsStatus = () => {
    const queryItAssetsStatus = useQuery({
        queryKey: ['it-assets-status'],
        queryFn: () => getItAssetsStatusAction(),
        staleTime: 1000 * 60 * 5,
        select: (response) => ({
            itAssetsStatus: response.itAssetsStatus,
        }),
    })

    return {
        itAssetsStatus: queryItAssetsStatus.data?.itAssetsStatus ?? [],
        isLoading: queryItAssetsStatus.isLoading,
        isFetching: queryItAssetsStatus.isFetching,
        error: queryItAssetsStatus.error,
        refetch: queryItAssetsStatus.refetch,
    }
}

export default useItAssetsStatus
import { useQuery } from "@tanstack/react-query"
import { getItAssetsStatusAction } from "../actions/get-itAssets-status"

const useItAssetsStatus = () => {
    const {
        data: queryData,
        isLoading,
        isFetching,
        error,
        refetch
    } = useQuery({
        queryKey: ['it-assets-status'],
        queryFn: () => getItAssetsStatusAction(),
        staleTime: 1000 * 60 * 5,
        select: (response) => ({
            itAssetsStatus: response.itAssetsStatus,
        }),
    })

    return {
        itAssetsStatus: queryData?.itAssetsStatus ?? [],
        isLoading,
        isFetching,
        error,
        refetch,
    }
}

export default useItAssetsStatus
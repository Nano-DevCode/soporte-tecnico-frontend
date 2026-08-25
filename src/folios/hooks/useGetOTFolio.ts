import { useQuery } from "@tanstack/react-query";
import { STALE_TIME_5_MIN } from "@/config/query-constants";
import { otFoliosQueryKeys } from "../keys/folios-query.keys";
import { getOTFolioAction } from "../actions/get-ot-folio.action";

export const useGetOTFolio = () => {
    const {
        data,
        isLoading,
        isError,
        isFetching,
        refetch
    } = useQuery({
        queryKey: otFoliosQueryKeys.details(),
        queryFn: () => getOTFolioAction(),
        retry: false,
        staleTime: STALE_TIME_5_MIN,
    });

    return {
        data,
        isLoading,
        isError,
        isFetching,
        refetch
    };
};

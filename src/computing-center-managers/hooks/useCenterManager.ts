import { useQuery } from "@tanstack/react-query";
import { STALE_TIME_5_MIN } from "@/config/query-constants";
import { centerManagerQueryKeys } from "../keys/center-manager-query.keys";
import { getCenterManagerByIdAction } from "../actions/get-center-manager-by-id.action";

export const useCenterManager = (id?: string) => {
    const {
        data,
        isLoading,
        isError,
        error,
        isFetching,
        refetch
    } = useQuery({
        queryKey: id ? centerManagerQueryKeys.detail(id) : centerManagerQueryKeys.details(),
        queryFn: () => getCenterManagerByIdAction(id!),
        retry: false,
        staleTime: STALE_TIME_5_MIN,
        enabled: !!id,
    });

    return {
        data,
        isLoading,
        isError,
        error,
        isFetching,
        refetch
    };
};
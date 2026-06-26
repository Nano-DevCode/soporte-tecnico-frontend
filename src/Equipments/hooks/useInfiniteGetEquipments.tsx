import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import { equipmentsInfinitQueryKeys } from "../keys/equipments-infite-query.keys";
import { STALE_TIME_5_MIN } from "@/config/query-constants";
import { getEquipmentsAction } from "../actions/get-equipments.action";

interface Props {
    search?: string;
    limit?: number;
}

export const useInfiniteGetEquipments = ({ search, limit = 15 }: Props = {}) => {
    const infiniteQuery = useInfiniteQuery({
        queryKey: equipmentsInfinitQueryKeys.list({ search, limit }),
        queryFn: async ({ pageParam }) => getEquipmentsAction({
            search,
            offset: (pageParam - 1) * limit,
            limit,
            category: "all"
        }),
        initialPageParam: 1,
        staleTime: STALE_TIME_5_MIN,
        getNextPageParam: (lastPage) => {
            if (lastPage.meta.page < lastPage.meta.lastPage) {
                return lastPage.meta.page + 1;
            }
            return undefined;
        },
        placeholderData: keepPreviousData,
    });

    return infiniteQuery;
}
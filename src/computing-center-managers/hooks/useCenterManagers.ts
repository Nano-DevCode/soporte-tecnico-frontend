import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { useSearchParams } from "react-router"
import { STALE_TIME_5_MIN } from "@/config/query-constants";
import { centerManagerQueryKeys } from "@/computing-center-managers/keys/center-manager-query.keys";
import { getCenterManagersAction } from "../actions/get-center-mnagers.action";

// TODO: Posible mejora al sacar useSearchParam de aqui, de forma que reciba el searchParam para reutilizar el componente.
// TODO: VERIFICAR EL FUNCIONAMIENTO DE PLACEHILDERDATA
export const useCenterManagers = () => {

    const [searchParams] = useSearchParams();

    const limit = Number(searchParams.get('limit')) || 10;
    const page = Number(searchParams.get('page')) || 1;
    const query = searchParams.get("search")?.trim() || undefined;
    const status = searchParams.get('status') || undefined;
    const statusValue = status === '1'
        ? true
        : status === '0'
            ? false
            : undefined;

    return useQuery({
        queryKey: centerManagerQueryKeys.list({ limit, page, query, status: statusValue }),
        queryFn: async () => getCenterManagersAction({
            limit,
            page,
            query,
            status: statusValue,
        }),
        placeholderData: keepPreviousData,
        staleTime: STALE_TIME_5_MIN,
    })
}

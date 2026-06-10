import { useQuery } from "@tanstack/react-query";
import { STALE_TIME_5_MIN } from "@/config/query-constants";
import { responseFoliosQueryKeys } from "../keys/folios-query.keys";
import { getResponseFolioAction } from "../actions/get-response-folio.action";

export const useGetResponseFolio = () => {
    const query = useQuery({
        queryKey: responseFoliosQueryKeys.details(),
        queryFn: () => getResponseFolioAction(),
        retry: false,
        staleTime: STALE_TIME_5_MIN,
    });

    return {
        ...query,
    };
};
import { useQuery } from "@tanstack/react-query";
import { STALE_TIME_5_MIN } from "@/config/query-constants";
import { technicalReportsQueryKeys } from "../keys/technical-reports-query.keys";
import { getTechnicalReportsAction } from "../actions/get-technical-reports.action";

export const useGetTechnicalReports = (id?: string) => {
    const query = useQuery({
        queryKey: id ? technicalReportsQueryKeys.detail(id) : technicalReportsQueryKeys.details(),
        queryFn: () => getTechnicalReportsAction(id!),
        retry: false,
        staleTime: STALE_TIME_5_MIN,
        enabled: !!id,
    });

    return {
        ...query,
    };
};
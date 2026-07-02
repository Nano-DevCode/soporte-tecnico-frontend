import { useQuery } from "@tanstack/react-query";
import { STALE_TIME_5_MIN } from "@/config/query-constants";
import { technicalReportsQueryKeys } from "../keys/technical-reports-query.keys";
import { getTechnicalReportByIdAction } from "../actions/get-technical-report-by-id.action";

export const useGetTechnicalReportById = (id?: string) => {
    const {
        data,
        isLoading,
        isError,
        error,
        isFetching,
        refetch
    } = useQuery({
        queryKey: id ? technicalReportsQueryKeys.detail(id) : technicalReportsQueryKeys.details(),
        queryFn: () => getTechnicalReportByIdAction(id!),
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
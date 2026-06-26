import { useQuery } from "@tanstack/react-query";
import { STALE_TIME_5_MIN } from "@/config/query-constants";
import { technicalReportsQueryKeys } from "../keys/technical-reports-query.keys";
import { getTechnicalReportsByTicketIdAction } from "../actions/get-technical-reports-by-ticket-id.action";

export const useGetTechnicalReportsByTicketId = (id?: string) => {
    const query = useQuery({
        queryKey: id ? technicalReportsQueryKeys.byTicket(id) : technicalReportsQueryKeys.all,
        queryFn: () => getTechnicalReportsByTicketIdAction(id!),
        retry: false,
        staleTime: STALE_TIME_5_MIN,
        enabled: !!id,
    });

    return {
        ...query,
    };
};
import { useQuery } from "@tanstack/react-query"
import { useSearchParams } from "react-router"
import { STALE_TIME_5_MIN } from "@/config/query-constants";
import type { TicketStatusCode } from "@/tickets/interfaces/ticket-status-code.interface";
import type { TicketPriorityLevelString } from "@/tickets/interfaces/ticket-priority-level.type";
import { getCriticalAvailabilityAction } from "../actions/get-critical-avalability";
import { dashboardQueryKeys } from "../keys/dashboard-query.keys";
export const useGetCriticalAvailability = () => {

    const [searchParams] = useSearchParams();

    const status = searchParams.get('status') as TicketStatusCode || undefined;
    const priority = searchParams.get('priority') as TicketPriorityLevelString || undefined;
    const department = searchParams.get('department') as string || undefined;
    const school_period = searchParams.get('school_period') as string || undefined;
    const issue_type = searchParams.get('issue_type') as string || undefined;
    const tags = searchParams.get('tags') as string || undefined;
    const start_date = searchParams.get('start_date') as string || undefined;
    const end_date = searchParams.get('end_date') as string || undefined;
    console.log(start_date)

    return useQuery({
        queryKey: dashboardQueryKeys.list({
            type: 'critical-availabilty',
            status, priority,
            department, school_period, issue_type, tags, start_date, end_date
        }),
        queryFn: async () => getCriticalAvailabilityAction({
            status,
            priority,
            department,
            school_period,
            issue_type,
            tags,
            start_date,
            end_date,
        }),
        staleTime: STALE_TIME_5_MIN,
    })
}

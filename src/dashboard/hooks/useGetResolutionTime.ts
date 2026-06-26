import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router";
import { STALE_TIME_5_MIN } from "@/config/query-constants";
import { dashboardQueryKeys } from "../keys/dashboard-query.keys";
import { getResolutionTimeAction } from "../actions/get-resolution-time.action";
import type { TicketStatusCode } from "@/tickets/interfaces/ticket-status-code.interface";
import type { TicketPriorityLevelString } from "@/tickets/interfaces/ticket-priority-level.type";

export const useGetResolutionTime = () => {
    const [searchParams] = useSearchParams();

    const filters = {
        status: searchParams.get('status') as TicketStatusCode || undefined,
        priority: searchParams.get('priority') as TicketPriorityLevelString || undefined,
        department: searchParams.get('department') || undefined,
        school_period: searchParams.get('school_period') || undefined,
        issue_type: searchParams.get('issue_type') || undefined,
        tags: searchParams.get('tags') || undefined,
        start_date: searchParams.get('start_date') || undefined,
        end_date: searchParams.get('end_date') || undefined,
    };

    return useQuery({
        queryKey: dashboardQueryKeys.list({
            type: 'resolution-time',
            ...filters
        }),
        queryFn: () => getResolutionTimeAction(filters),
        staleTime: STALE_TIME_5_MIN,
    });
};
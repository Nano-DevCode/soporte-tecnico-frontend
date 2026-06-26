import { useQuery } from '@tanstack/react-query';
import type { TicketStatusCode } from '@/tickets/interfaces/ticket-status-code.interface';
import type { TicketPriorityLevelString } from '@/tickets/interfaces/ticket-priority-level.type';
import { getFirstLevelResolutionAction } from '../actions/get-first-leven-resolution.action';
import { dashboardQueryKeys } from '../keys/dashboard-query.keys';
import { STALE_TIME_5_MIN } from '@/config/query-constants';
import { useSearchParams } from 'react-router';

export const useFirstLevelResolution = () => {
    const [searchParams] = useSearchParams();

    const status = searchParams.get('status') as TicketStatusCode || undefined;
    const priority = searchParams.get('priority') as TicketPriorityLevelString || undefined;
    const department = searchParams.get('department') as string || undefined;
    const school_period = searchParams.get('school_period') as string || undefined;
    const issue_type = searchParams.get('issue_type') as string || undefined;
    const tags = searchParams.get('tags') as string || undefined;
    const start_date = searchParams.get('start_date') as string || undefined;
    const end_date = searchParams.get('end_date') as string || undefined;

    return useQuery({
        queryKey: dashboardQueryKeys.list({
            type: 'first-level-resolution',
            status, priority,
            department, school_period, issue_type, tags, start_date, end_date
        }),
        queryFn: () => getFirstLevelResolutionAction(
            {
                status,
                priority,
                department,
                school_period,
                issue_type,
                tags,
                start_date,
                end_date,
            }
        ),

        staleTime: STALE_TIME_5_MIN,
    });
};
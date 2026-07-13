import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { STALE_TIME_5_MIN } from "@/config/query-constants";
import { IssueTypesQueryKeys } from "../keys/issue-types-query.keys";
import { getAllIssueTypesAction } from "../actions/get-all-issue-types";

interface Options {
    enabled?: boolean;
}

export const useAllIssueTypes = (options?: Options) => {
    return useQuery({
        queryKey: IssueTypesQueryKeys.lists(),
        queryFn: async () => getAllIssueTypesAction(),
        placeholderData: keepPreviousData,
        staleTime: STALE_TIME_5_MIN,
        enabled: options?.enabled !== undefined ? options.enabled : true,
    })
}

import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { STALE_TIME_5_MIN } from "@/config/query-constants";
import { IssueTypesQueryKeys } from "../keys/issue-types-query.keys";
import { getAllIssueTypesAction } from "../actions/get-all-issue-types";
export const useAllIssueTypes = () => {
    return useQuery({
        queryKey: IssueTypesQueryKeys.lists(),
        queryFn: async () => getAllIssueTypesAction(),
        placeholderData: keepPreviousData,
        staleTime: STALE_TIME_5_MIN,
    })
}

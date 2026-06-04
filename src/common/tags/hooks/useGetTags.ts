import { keepPreviousData, useInfiniteQuery, useQuery } from "@tanstack/react-query"
import { getTagsAction } from "../actions/get-tags.action"
import { tagsInfinitQueryKeys, tagsQueryKeys } from "../keys/tags-query.keys"
import { STALE_TIME_5_MIN } from "@/config/query-constants";

interface UseGetTagsProps {
    search?: string;
    limit?: number;
    page?: number;
}

export const useGetTags = ({ search, limit = 15, page = 1 }: UseGetTagsProps = {}) => {
    const query = useQuery({
        queryKey: tagsQueryKeys.list({ search, limit, page }),
        queryFn: async () => getTagsAction({ search, page, limit }),
        staleTime: STALE_TIME_5_MIN,
    });

    return query;
}

export const useInfiniteGetTags = ({ search, limit = 15 }: Omit<UseGetTagsProps, 'page'> = {}) => {
    const infiniteQuery = useInfiniteQuery({
        queryKey: tagsInfinitQueryKeys.list({ search, limit }),
        queryFn: async ({ pageParam }) => getTagsAction({
            search,
            page: pageParam,
            limit
        }),
        initialPageParam: 1,
        staleTime: STALE_TIME_5_MIN,
        getNextPageParam: (lastPage) => {
            if (lastPage.meta.hasNextPage) {
                return lastPage.meta.page + 1;
            }
            return undefined;
        },
        placeholderData: keepPreviousData,
    });

    return infiniteQuery;
}

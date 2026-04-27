import { useQuery } from "@tanstack/react-query"
import { getTagsAction } from "../actions/get-tags.action"
import { tagsQueryKeys } from "../keys/tags-query.keys"
export const useGetTags = () => {

    return useQuery({
        queryKey: tagsQueryKeys.lists(),
        queryFn: async () => getTagsAction(),
    })
}

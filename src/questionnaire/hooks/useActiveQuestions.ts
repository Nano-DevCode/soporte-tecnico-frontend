import { useQuery } from "@tanstack/react-query";
import { STALE_TIME_5_MIN } from "@/config/query-constants";
import { questionQueryKeys } from "../keys/questions-query.keys";
import { getActiveQuestions } from "../actions/get-active-questions.action";

export const useActiveQuestions = () => {
    return useQuery({
        queryKey: questionQueryKeys.active(),
        queryFn: async () => getActiveQuestions(),
        staleTime: STALE_TIME_5_MIN,
    });
};
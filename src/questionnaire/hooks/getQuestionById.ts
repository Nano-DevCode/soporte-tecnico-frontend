import { useQuery } from "@tanstack/react-query";
import { questionQueryKeys } from "../keys/questions-query.keys";
import { getQuestionByIdAction } from "../actions/get-question-by-id.action";
import { STALE_TIME_5_MIN } from "@/config/query-constants";

export const useGetQuestionById = (id: string) => {
    return useQuery({
        queryKey: questionQueryKeys.detail(id),
        queryFn: () => getQuestionByIdAction(id),
        enabled: !!id,
        staleTime: STALE_TIME_5_MIN,
    });
};
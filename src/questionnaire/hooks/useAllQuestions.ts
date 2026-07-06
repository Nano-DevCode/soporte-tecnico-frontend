import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router";
import { STALE_TIME_5_MIN } from "@/config/query-constants";
import { questionQueryKeys } from "../keys/questions-query.keys";
import { getAllQuestionsAction } from "../actions/get-all-questions.action";

export const useAllQuestions = () => {
    const [searchParams] = useSearchParams();

    const limit = Number(searchParams.get('limit')) || 10;
    const page = Number(searchParams.get('page')) || 1;
    const search = searchParams.get("search")?.trim() || undefined;
    const isActiveParam = searchParams.get('is_active');
    const is_active =
        isActiveParam === 'true' ? true :
            isActiveParam === 'false' ? false :
                undefined;

    return useQuery({
        queryKey: questionQueryKeys.list({
            limit,
            page,
            search,
            is_active,
        }),
        queryFn: async () => getAllQuestionsAction({
            limit,
            page,
            search,
            is_active,
        }),
        staleTime: STALE_TIME_5_MIN,
    });
};
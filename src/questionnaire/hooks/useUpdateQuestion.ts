import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateQuestionAction } from "../actions/update-question.action";
import { questionQueryKeys } from "../keys/questions-query.keys";

export const useUpdateQuestion = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateQuestionAction,
        onSuccess: (updatedQuestion) => {
            queryClient.invalidateQueries({
                queryKey: questionQueryKeys.lists(),
            });

            queryClient.invalidateQueries({
                queryKey: questionQueryKeys.active(),
            });

            queryClient.invalidateQueries({
                queryKey: questionQueryKeys.detail(updatedQuestion.id),
            });
        },
    });
};
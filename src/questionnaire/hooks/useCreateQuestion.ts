import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createQuestionAction } from '../actions/create-question.action';
import { questionQueryKeys } from '../keys/questions-query.keys';

export const useCreateQuestion = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createQuestionAction,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: questionQueryKeys.lists(),
            });
        },
    });
};
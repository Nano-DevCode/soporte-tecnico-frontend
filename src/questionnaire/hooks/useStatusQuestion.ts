import { useMutation, useQueryClient } from '@tanstack/react-query';
import { activateQuestionAction, deactivateQuestionAction } from '../actions/question-status.actions';
import { questionQueryKeys } from '../keys/questions-query.keys';

export const useActivateQuestion = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: activateQuestionAction,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: questionQueryKeys.all });
        },
    });
};

export const useDeactivateQuestion = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deactivateQuestionAction,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: questionQueryKeys.all });
        },
    });
};
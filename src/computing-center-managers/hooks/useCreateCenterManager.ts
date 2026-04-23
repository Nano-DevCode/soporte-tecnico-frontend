import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCenterManagerAction } from "../actions/create-center-manager.action";
import { centerManagerQueryKeys } from "../keys/center-manager-query.keys";
import type { CenterManager } from "../interfaces/center-manager.interface";

export const useCreateCenterManager = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createCenterManagerAction,
        onSuccess: (centerManager: CenterManager) => {
            queryClient.invalidateQueries({
                queryKey: centerManagerQueryKeys.lists()
            });
            queryClient.setQueryData(
                centerManagerQueryKeys.detail(centerManager.id),
                centerManager
            );
        },
    });
};
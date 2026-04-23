import { useMutation, useQueryClient } from "@tanstack/react-query";
import { centerManagerQueryKeys } from "../keys/center-manager-query.keys";
import type { CenterManager } from "../interfaces/center-manager.interface";
import { updateCenterManagerAction } from "../actions/update-center-manager.action";

export const useUpdateCenterManager = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateCenterManagerAction,
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
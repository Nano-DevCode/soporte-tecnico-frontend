import { useMutation, useQueryClient } from "@tanstack/react-query";
import { activateCenterManagerAction } from "../actions/activate-center-manager.action";
import type { CenterManager } from "../interfaces/center-manager.interface";
import { centerManagerQueryKeys } from "../keys/center-manager-query.keys";

export const useActivateCenterManager = () => {
    const queryClient = useQueryClient();

    const activateMutation = useMutation({
        mutationFn: activateCenterManagerAction,
        onSuccess: (updatedCenterManager: CenterManager) => {
            queryClient.invalidateQueries({ queryKey: centerManagerQueryKeys.lists() });
            queryClient.setQueryData(
                centerManagerQueryKeys.detail(updatedCenterManager.id),
                updatedCenterManager
            );
        }
    });

    return activateMutation;
};
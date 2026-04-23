import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deactivateCenterManagerAction } from "../actions/deactivate-center-manager.action";
import type { CenterManager } from "../interfaces/center-manager.interface";
import { centerManagerQueryKeys } from "../keys/center-manager-query.keys";

export const useDeactivateCenterManager = () => {
    const queryClient = useQueryClient();

    const deactivateMutation = useMutation({
        mutationFn: deactivateCenterManagerAction,
        onSuccess: (updatedCenterManager: CenterManager) => {
            queryClient.invalidateQueries({ queryKey: centerManagerQueryKeys.lists() });
            queryClient.setQueryData(
                centerManagerQueryKeys.detail(updatedCenterManager.id),
                updatedCenterManager
            );
        }
    });

    return deactivateMutation;
};
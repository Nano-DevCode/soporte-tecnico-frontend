import { useMutation, useQueryClient } from "@tanstack/react-query";
import { foliosQueryKeys } from "../keys/folios-query.keys";
import type { ItemFolio } from "../interfaces/get-folios.interface";
import { updateMyTicketFolioDepartmentAction } from "../actions/update-my-ticket-folio-department.action";

export const useEditMyTicketFolioDepartment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateMyTicketFolioDepartmentAction,
        onSuccess: (updatedFolio: ItemFolio) => {
            queryClient.invalidateQueries({
                queryKey: foliosQueryKeys.lists()
            });
            queryClient.setQueryData(
                foliosQueryKeys.detail('my-department'),
                updatedFolio
            );
        },
    });
};
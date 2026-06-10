import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTicketFolioDepartmentAction } from "../actions/update-ticket-folio-department.action";
import { foliosQueryKeys } from "../keys/folios-query.keys";
import type { ItemFolio } from "../interfaces/get-folios.interface";

export const useEditTicketFolioDepartment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateTicketFolioDepartmentAction,
        onSuccess: (ItemFolio: ItemFolio) => {
            queryClient.invalidateQueries({
                queryKey: foliosQueryKeys.lists()
            });
            queryClient.setQueryData(
                foliosQueryKeys.detail(ItemFolio.department_id),
                ItemFolio
            );
        },
    });
};
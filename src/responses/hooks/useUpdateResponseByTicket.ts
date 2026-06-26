import { useMutation, useQueryClient } from "@tanstack/react-query";
import { responsesQueryKeys } from "../keys/responses-query.keys";
import type { ResponseDetails } from "../interfaces/get-response-by-ticket";
import { updateResponseByTicketAction } from "../actions/update-response-by-ticket.action";

export const useUpdateResponseByTicket = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateResponseByTicketAction,
        onSuccess: (updatedRespons: ResponseDetails) => {
            queryClient.invalidateQueries({
                queryKey: responsesQueryKeys.byTicket(updatedRespons.ticket.id),
            });
        },
    });
};
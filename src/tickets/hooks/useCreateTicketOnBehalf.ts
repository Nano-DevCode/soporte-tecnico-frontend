import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { TicketDetailsResponse } from "../interfaces/ticket-details.response";
import { ticketsQueryKeys } from "../keys/tickets-query.keys";
import { createTicketOnBehalfAction } from "../actions/create-ticket-on-behalf.action";

export const useCreateTicketOnBehalf = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createTicketOnBehalfAction,
        onSuccess: (ticket: TicketDetailsResponse) => {
            queryClient.invalidateQueries({
                queryKey: ticketsQueryKeys.lists()
            });
            queryClient.setQueryData(
                ticketsQueryKeys.detail(ticket.id),
                ticket
            );
        },
    });
};
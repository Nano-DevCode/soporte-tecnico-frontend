import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { TicketDetailsResponse } from "../interfaces/ticket-details.response";
import { ticketsQueryKeys } from "../keys/tickets-query.keys";
import { closeTicketAction } from "../actions/close-ticket.action";

export const useCloseTicket = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: closeTicketAction,
        onSuccess: (ticket: TicketDetailsResponse) => {
            queryClient.invalidateQueries({
                queryKey: ticketsQueryKeys.lists()
            });
            queryClient.invalidateQueries({
                queryKey: ticketsQueryKeys.currentLists()
            });
            queryClient.setQueryData(
                ticketsQueryKeys.detail(ticket.id),
                ticket
            );
        },
    });
};
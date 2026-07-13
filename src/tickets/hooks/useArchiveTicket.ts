import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { TicketDetailsResponse } from "../interfaces/ticket-details.response";
import { ticketsQueryKeys } from "../keys/tickets-query.keys";
import { archiveTicketAction } from "../actions/archive-ticket.action";

export const useArchiveTicket = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: archiveTicketAction,
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
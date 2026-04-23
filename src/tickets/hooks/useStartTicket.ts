import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { TicketDetailsResponse } from "../interfaces/ticket-details.response";
import { ticketsQueryKeys } from "../keys/tickets-query.keys";
import { startTicketAction } from "../actions/start-ticket.action";

export const useStartTicket = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: startTicketAction,
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
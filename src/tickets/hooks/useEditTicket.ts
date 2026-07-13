import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { TicketDetailsResponse } from "../interfaces/ticket-details.response";
import { ticketsQueryKeys } from "../keys/tickets-query.keys";
import { editTicketAction } from "../actions/edit-ticket.action";

export const useEditTicket = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: editTicketAction,
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
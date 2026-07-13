import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { TicketDetailsResponse } from "../interfaces/ticket-details.response";
import { ticketsQueryKeys } from "../keys/tickets-query.keys";
import { interveneTicketAction } from "../actions/intervene-ticket.action";
import { technicalReportsQueryKeys } from "../../technical-reports/keys/technical-reports-query.keys";
import { tagsInfinitQueryKeys } from "@/common/tags/keys/tags-query.keys";

export const useInterveneTicket = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: interveneTicketAction,
        onSuccess: (ticket: TicketDetailsResponse) => {
            queryClient.invalidateQueries({
                queryKey: ticketsQueryKeys.lists()
            });
            queryClient.invalidateQueries({
                queryKey: technicalReportsQueryKeys.lists()
            });
            queryClient.invalidateQueries({
                queryKey: technicalReportsQueryKeys.byTicket(ticket.id)
            });
            queryClient.invalidateQueries({
                queryKey: tagsInfinitQueryKeys.lists()
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
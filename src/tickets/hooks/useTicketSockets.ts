import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { ticketsQueryKeys } from '../keys/tickets-query.keys';
import { socket } from '../websockets/socket';

export const useTicketSockets = () => {
    const queryClient = useQueryClient();

    useEffect(() => {
        if (!socket.connected) {
            socket.connect();
        }

        const handleTicketUpdated = (ticketId: string) => {
            queryClient.invalidateQueries({
                queryKey: ticketsQueryKeys.currentLists(),
            });

            if (ticketId) {
                queryClient.invalidateQueries({
                    queryKey: ticketsQueryKeys.detail(ticketId),
                });
            }
        };

        // const handleFormalResponse = (data: { ticketId: string; message: string }) => {
        //   handleTicketUpdated(data.ticketId);
        // };

        socket.on('ticket_updated', handleTicketUpdated);
        socket.on('new_assignment', handleTicketUpdated);

        return () => {
            socket.off('ticket_updated', handleTicketUpdated);
            socket.off('new_assignment', handleTicketUpdated);
        };
    }, [queryClient]);
};
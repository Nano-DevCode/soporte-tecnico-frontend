import { Card, CardContent } from "@/components/ui/card";
import { TicketStatusBadge } from "../TicketStatusBadge";
import type { TicketDetailsResponse } from "@/tickets/interfaces/ticket-details.response";
import { TicketPriorityBadge } from "../TicketPriorityBadge";
import { TicketTagsBadge } from "../TicketTagsBadge";
import { Hash } from "lucide-react";
import { Can } from "@/common/permission/Can";

export interface Props {
    ticket: TicketDetailsResponse;
}

export const DetailHeaderTicket = ({ ticket }: Props) => {

    return (
        <Card>
            <CardContent className="space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                        <Hash className="h-5 w-5 text-muted-foreground" strokeWidth={2.5} />
                        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-nowrap">
                            {ticket.folio}
                        </h2>
                        <span className="font-semibold text-muted-foreground">
                            - {ticket.jefe_depto.department.name}
                        </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <TicketStatusBadge statusCode={ticket.currentStatusCode} />
                        <Can permission='WATCH_TICKET_PRIORITY'>
                            <TicketPriorityBadge priority={ticket.priority} />
                        </Can>
                    </div>
                </div>

                <Can permission='WATCH_TICKET_TAGS'>
                    {ticket.tags && ticket.tags.length > 0 && (
                        <div className="flex flex-wrap justify-end gap-2">
                            <TicketTagsBadge tags={ticket.tags} />
                        </div>
                    )}
                </Can>

            </CardContent>
        </Card>
    );
};
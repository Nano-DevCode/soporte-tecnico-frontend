import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { TicketStatusBadge } from "../TicketStatusBadge"
import type { TicketDetailsResponse } from "@/tickets/interfaces/ticket-details.response";
import { TicketActions } from "./TicketActions";
import { useTranslation } from "react-i18next";
import { TicketPriorityBadge } from "../TicketPriorityBadge";
import { getFullName } from "@/lib/helpers/toFullName";
import type { TicketEvent } from "@/tickets/utils/ticket-state-machine";

export interface Props {
    ticket: TicketDetailsResponse;
    onDirectAction?: (event: TicketEvent) => void;
    pendingEvent?: TicketEvent | null;
}
export const DetailHeaderTicket = ({ ticket, onDirectAction, pendingEvent }: Props) => {
    const { t } = useTranslation();
    return (
        <Card>
            <CardContent>
                <div className="flex flex-row flex-wrap gap-2">
                    <div className="text-muted-foreground font-medium  text-sm wrap-break-word">

                        <h2 className="text-xl font-bold tracking-tight text-foreground ">
                            {ticket.folio}
                        </h2>
                        <p >
                            {t("tickets.data.department")}
                            : <span className="text-foreground">
                                {ticket.jefe_depto.department.name}
                            </span>
                        </p>

                        {(ticket.coordinator) && (
                            <p>
                                {t('tickets.data.canalized_to')}
                                <span className="text-foreground">
                                    {ticket.coordinator.name}
                                </span>
                            </p>
                        )}
                        {ticket.attends.length > 0 && (
                            <p>
                                {t('tickets.data.asigned_to')}
                                <span className="text-foreground">
                                    {ticket.attends.map((a) =>
                                        getFullName(
                                            a.technician.name,
                                            a.technician.paternalSurname,
                                            a.technician.maternalSurname)
                                    ).join(', ')}
                                </span>
                            </p>
                        )}
                    </div>
                    <div className="flex flex-col gap-2 flex-1">
                        <div className="flex justify-end gap-2">
                            <TicketStatusBadge statusCode={ticket.currentStatusCode} />
                            <TicketPriorityBadge priority={ticket.priority} />
                        </div>
                        {/* TODO: tags */}
                    </div>
                </div>
            </CardContent>
            <CardFooter >
                <TicketActions
                    currentState={ticket.currentStatusCode}
                    ticketId={ticket.id}
                    onDirectAction={onDirectAction}
                    pendingEvent={pendingEvent}
                />
            </CardFooter>
        </Card>
    )
}

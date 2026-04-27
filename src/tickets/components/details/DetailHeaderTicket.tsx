import { Card, CardContent } from "@/components/ui/card"
import { TicketStatusBadge } from "../TicketStatusBadge"
import type { TicketDetailsResponse } from "@/tickets/interfaces/ticket-details.response";
import { useTranslation } from "react-i18next";
import { TicketPriorityBadge } from "../TicketPriorityBadge";
import { getFullName } from "@/lib/helpers/toFullName";
import { TicketTagsBadge } from "../TicketTagsBadge";

export interface Props {
    ticket: TicketDetailsResponse;
}
export const DetailHeaderTicket = ({ ticket }: Props) => {
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
                                    {getFullName(
                                        ticket.coordinator.name,
                                        ticket.coordinator.paternalSurname,
                                        ticket.coordinator.maternalSurname)
                                    }
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
                    <div className="flex flex-col gap-4 flex-1">
                        <div className="flex justify-end gap-2">
                            <TicketStatusBadge statusCode={ticket.currentStatusCode} />
                            <TicketPriorityBadge priority={ticket.priority} />
                        </div>

                        <TicketTagsBadge tags={ticket.tags} />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

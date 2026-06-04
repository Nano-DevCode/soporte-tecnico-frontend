import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { getFullName } from "@/lib/helpers/toFullName";
import type { TicketDetailsResponse } from "@/tickets/interfaces/ticket-details.response";
import { Separator } from "@/components/ui/separator";
import { CustomHeaderCard } from "@/components/custom/CustomHeaderCard";
import { Users } from "lucide-react";

export interface Props {
    ticket: TicketDetailsResponse;
}

export const TicketActorsCard = ({ ticket }: Props) => {
    const { t } = useTranslation();

    const hasActors = ticket.coordinator || ticket.attends.length > 0;

    if (!hasActors) return null;
    return (
        <Card>
            <CardHeader className="gap-0">
                <CustomHeaderCard
                    icon={Users}
                    title={t('tickets.view_page.involved_staff.title')}
                    description={t('tickets.view_page.involved_staff.description')}
                />
            </CardHeader>
            <Separator />
            <CardContent className="space-y-5">

                {ticket.coordinator && (
                    <div className="flex flex-col">
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            {t('tickets.data.canalized_to')}
                        </span>
                        <span className="text-sm font-semibold text-foreground leading-relaxed pl-2">
                            {getFullName(ticket.coordinator.name, ticket.coordinator.paternalSurname, ticket.coordinator.maternalSurname)}
                        </span>
                    </div>
                )}

                {ticket.attends.length > 0 && (
                    <div className="flex flex-col">
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            {t('tickets.data.asigned_to')}
                        </span>
                        <ul className="space-y-1">
                            {ticket.attends.map((a) => (
                                <li key={a.technician.id} className="pl-2 text-sm font-semibold text-foreground leading-relaxed">
                                    - {getFullName(a.technician.name, a.technician.paternalSurname, a.technician.maternalSurname)}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import type { TicketDetailsResponse } from "../../interfaces/ticket-details.response"
import { CustomSectionInfo } from "@/components/custom/CustomSectionInfo";
import { CustomInfoRow } from "@/components/custom/CustomInfoRow";
import { AlignLeft, Building, Clock, Mail, MapPin, Ticket, UserRound, Wrench } from "lucide-react";
import { useTranslation } from "react-i18next";
import { CustomHeaderCard } from "@/components/custom/CustomHeaderCard";
import { getFullName } from "@/lib/helpers/toFullName";

export interface Props {
    ticket: TicketDetailsResponse;
}
export const DetailsTicket = ({ ticket }: Props) => {
    const { t } = useTranslation();
    return (
        <Card>
            <CardHeader className="gap-0">
                <CustomHeaderCard
                    title={t('tickets.form.header.title')}
                    description={t('tickets.form.header.description')}
                    icon={Ticket}
                />
            </CardHeader>
            <Separator />
            <CardContent className="space-y-5">
                <CustomSectionInfo label={t('tickets.view_page.details.sections.sender_info')} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-5">
                    <CustomInfoRow
                        icon={<UserRound className="w-4 h-4 text-muted-foreground" />}
                        label={t('tickets.data.sender_name')}
                        value={getFullName(
                            ticket.jefe_depto.name,
                            ticket.jefe_depto.paternalSurname,
                            ticket.jefe_depto.maternalSurname
                        )}
                    />

                    <CustomInfoRow
                        icon={<Building className="w-4 h-4 text-muted-foreground" />}
                        label={t('tickets.data.department')}
                        value={ticket.jefe_depto.department.name}
                    />
                </div>

                <CustomSectionInfo label={t('tickets.view_page.details.sections.requester_info')} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-5">
                    <CustomInfoRow
                        icon={<UserRound className="w-4 h-4 text-muted-foreground" />}
                        label={t('tickets.data.affected_name')}
                        value={ticket.affected_name}
                    />

                    <CustomInfoRow
                        icon={<Mail className="w-4 h-4 text-muted-foreground" />}
                        label={t('tickets.data.email')}
                        value={ticket.contact_email}
                    />

                    <CustomInfoRow
                        icon={<MapPin className="w-4 h-4 text-muted-foreground" />}
                        label={t('tickets.data.equipment_location')}
                        value={ticket.equipment_location}
                    />

                    <CustomInfoRow
                        icon={<Clock className="w-4 h-4 text-muted-foreground" />}
                        label={t('tickets.data.available_hours')}
                        value={ticket.available_hours}
                    />
                </div>

                <Separator />

                <CustomSectionInfo label={t('tickets.view_page.details.sections.issue_details')} />
                <div className="grid grid-cols-1 gap-y-5">
                    <CustomInfoRow
                        icon={<Wrench className="w-4 h-4 text-muted-foreground" />}
                        label={t('tickets.data.issue_type')}
                        value={ticket.issue_type.name}
                    />

                    <CustomInfoRow
                        icon={<AlignLeft className="w-4 h-4 text-muted-foreground" />}
                        label={t('tickets.data.description')}
                        value={ticket.description}
                    />
                </div>
            </CardContent>
        </Card>
    )
}

import { CustomHeaderCard } from "@/components/custom/CustomHeaderCard";
import { CustomInfoRow } from "@/components/custom/CustomInfoRow";
import { CustomSectionInfo } from "@/components/custom/CustomSectionInfo";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { ItemFolio } from "../interfaces/get-folios.interface";
import { Building, CalendarRange, Hash, Tickets, Type } from "lucide-react";
import { useTranslation } from "react-i18next";

interface Props {
    ticketFolio: ItemFolio;
    children?: React.ReactNode;
}
export const DetailsTicketFolio = ({ ticketFolio, children }: Props) => {
    const { t } = useTranslation();

    return (
        <Card>
            <CardHeader className="gap-0">
                <CustomHeaderCard
                    title={t('folios.tickets.forms.folio.header.title')}
                    description={t('folios.tickets.forms.folio.header.description')}
                    icon={Tickets}
                />
            </CardHeader>
            <Separator />
            <CardContent className="space-y-5">
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-y-5">
                    <div className="space-y-5 col-span-2">
                        <CustomSectionInfo label={t('folios.tickets.view_page.details.sections.department_details')} />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-5">
                            <CustomInfoRow
                                icon={<Building className="w-4 h-4 text-muted-foreground" />}
                                label={t('folios.data.department_name')}
                                value={ticketFolio.department_name}
                            />

                            <CustomInfoRow
                                icon={<Type className="w-4 h-4 text-muted-foreground" />}
                                label={t('folios.data.acronym')}
                                value={ticketFolio.acronym}
                            />
                        </div>
                    </div>
                    <div className="space-y-5">
                        <Separator className="xl:hidden" />
                        <CustomSectionInfo label={t('folios.tickets.view_page.details.sections.period_details')} />
                        <CustomInfoRow
                            icon={<CalendarRange className="w-4 h-4 text-muted-foreground" />}
                            label={t('folios.data.period_name')}
                            value={ticketFolio.period_name}
                        />
                    </div>
                </div>

                <Separator />

                <CustomSectionInfo label={t('folios.tickets.view_page.details.sections.folio_details')} />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-y-5">
                    <CustomInfoRow
                        icon={<Hash className="w-4 h-4 text-muted-foreground" />}
                        label={t('folios.data.current_value')}
                        tooltipDescription={t('folios.tickets.data_description.current_value')}
                        value={ticketFolio.current_value}
                    />

                    <CustomInfoRow
                        icon={<Hash className="w-4 h-4 text-muted-foreground" />}
                        label={t('folios.data.next_value')}
                        tooltipDescription={t('folios.tickets.data_description.next_value')}
                        value={ticketFolio.next_value}
                    />

                    <CustomInfoRow
                        icon={<Hash className="w-4 h-4 text-muted-foreground" />}
                        label={t('folios.data.next_folio_preview')}
                        tooltipDescription={t('folios.tickets.data_description.next_folio_preview')}
                        value={ticketFolio.next_folio_preview}
                    />
                </div>

            </CardContent>
            {children}
        </Card>
    )
}


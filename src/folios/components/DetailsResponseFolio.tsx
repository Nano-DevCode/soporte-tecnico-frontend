import { CustomHeaderCard } from "@/components/custom/CustomHeaderCard";
import { CustomInfoRow } from "@/components/custom/CustomInfoRow";
import { CustomSectionInfo } from "@/components/custom/CustomSectionInfo";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CalendarRange, Hash, Tickets } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { ResponseFolio } from "../interfaces/get-folios.interface";

interface Props {
    responseFolio: ResponseFolio;
    children?: React.ReactNode;
}
export const DetailsResponseFolio = ({ responseFolio: responseFolio, children }: Props) => {
    const { t } = useTranslation();

    return (
        <Card>
            <CardHeader className="gap-0">
                <CustomHeaderCard
                    title={t('folios.responses.forms.folio.header.title')}
                    description={t('folios.responses.forms.folio.header.description')}
                    icon={Tickets}
                />
            </CardHeader>
            <Separator />
            <CardContent className="space-y-5">
                <div className="grid grid-cols-1 gap-y-5">
                    <Separator className="xl:hidden" />
                    <CustomSectionInfo label={t('folios.responses.view_page.details.sections.period_details')} />
                    <CustomInfoRow
                        icon={<CalendarRange className="w-4 h-4 text-muted-foreground" />}
                        label={t('folios.data.period_name')}
                        value={responseFolio.period_name}
                    />
                </div>

                <Separator />

                <CustomSectionInfo label={t('folios.responses.view_page.details.sections.folio_details')} />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-y-5">
                    <CustomInfoRow
                        icon={<Hash className="w-4 h-4 text-muted-foreground" />}
                        label={t('folios.data.current_value')}
                        tooltipDescription={t('folios.responses.data_description.current_value')}
                        value={responseFolio.current_value}
                    />

                    <CustomInfoRow
                        icon={<Hash className="w-4 h-4 text-muted-foreground" />}
                        label={t('folios.data.next_value')}
                        tooltipDescription={t('folios.responses.data_description.next_value')}
                        value={responseFolio.next_value}
                    />

                    <CustomInfoRow
                        icon={<Hash className="w-4 h-4 text-muted-foreground" />}
                        label={t('folios.data.next_folio_preview')}
                        tooltipDescription={t('folios.responses.data_description.next_folio_preview')}
                        value={responseFolio.next_folio_preview}
                    />
                </div>

            </CardContent>
            {children}
        </Card>
    )
}


import { CustomHeaderCard } from "@/components/custom/CustomHeaderCard";
import { CustomInfoRow } from "@/components/custom/CustomInfoRow";
import { CustomSectionInfo } from "@/components/custom/CustomSectionInfo";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CalendarRange, Hash, Tickets } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { OTFolio } from "../interfaces/get-folios.interface";

interface Props {
    otFolio: OTFolio;
    children?: React.ReactNode;
}
export const DetailsOTFolio = ({ otFolio, children }: Props) => {
    const { t } = useTranslation();

    return (
        <Card>
            <CardHeader className="gap-0">
                <CustomHeaderCard
                    title={t('folios.ot.details.header_title')}
                    description={t('folios.ot.details.header_description')}
                    icon={Tickets}
                />
            </CardHeader>
            <Separator />
            <CardContent className="space-y-5">
                <div className="grid grid-cols-1 gap-y-5">
                    <Separator className="xl:hidden" />
                    <CustomSectionInfo label={t('folios.ot.details.period_section')} />
                    <CustomInfoRow
                        icon={<CalendarRange className="w-4 h-4 text-muted-foreground" />}
                        label={t('folios.ot.details.year')}
                        value={otFolio.year}
                    />
                </div>

                <Separator />

                <CustomSectionInfo label={t('folios.ot.details.counter_section')} />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-y-5">
                    <CustomInfoRow
                        icon={<Hash className="w-4 h-4 text-muted-foreground" />}
                        label={t('folios.data.current_value')}
                        tooltipDescription={t('folios.ot.details.current_value')}
                        value={otFolio.current_value}
                    />

                    <CustomInfoRow
                        icon={<Hash className="w-4 h-4 text-muted-foreground" />}
                        label={t('folios.data.next_value')}
                        tooltipDescription={t('folios.ot.details.next_value')}
                        value={otFolio.next_value}
                    />

                    <CustomInfoRow
                        icon={<Hash className="w-4 h-4 text-muted-foreground" />}
                        label={t('folios.data.next_folio_preview')}
                        tooltipDescription={t('folios.ot.details.preview')}
                        value={otFolio.next_folio_preview}
                    />
                </div>

            </CardContent>
            {children}
        </Card>
    )
}

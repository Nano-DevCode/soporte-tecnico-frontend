import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CustomSectionInfo } from "@/components/custom/CustomSectionInfo";
import { CustomInfoRow } from "@/components/custom/CustomInfoRow";
import { AlignLeft, Ban, Calendar } from "lucide-react";
import { useTranslation } from "react-i18next";
import { CustomHeaderCard } from "@/components/custom/CustomHeaderCard";
import { toFormatLocalDateString } from "@/lib/helpers/to-format-local-date-string";
import { useGetRejectionReport } from "@/tickets/hooks/useGetRejectionReport";
import { CustomFullScreenLoading } from "@/components/custom/CustomFullScreenLoading";

export interface Props {
    ticketId: string;
}

export const RejectionReportDetails = ({ ticketId }: Props) => {
    const { t, i18n } = useTranslation();

    const { data: report, isLoading, isError } = useGetRejectionReport(ticketId);

    if (isLoading) return <CustomFullScreenLoading />;

    if (isError || !report) return null;

    return (
        <Card >
            <CardHeader className="gap-0">
                <CustomHeaderCard
                    title={t('tickets.rejection_report.header.title')}
                    description={t('tickets.rejection_report.header.description')}
                    icon={Ban}
                />
            </CardHeader>
            <Separator />
            <CardContent className="space-y-5">
                <CustomSectionInfo label={t('tickets.rejection_report.sections.details')} />

                <div className="grid gap-y-5">
                    <CustomInfoRow
                        icon={<Calendar className="w-4 h-4 text-muted-foreground" />}
                        label={t('tickets.rejection_report.data.date')}
                        value={toFormatLocalDateString(report.created_at, i18n.language)}
                    />

                    <CustomInfoRow
                        icon={<AlignLeft className="w-4 h-4 text-muted-foreground" />}
                        label={t('tickets.rejection_report.data.justification')}
                        value={report.justification}
                    />
                </div>
            </CardContent>
        </Card>
    );
};
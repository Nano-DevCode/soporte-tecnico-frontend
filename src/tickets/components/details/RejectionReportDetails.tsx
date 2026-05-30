import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CustomSectionInfo } from "@/components/custom/CustomSectionInfo";
import { CustomInfoRow } from "@/components/custom/CustomInfoRow";
import { AlertCircle, AlignLeft, Calendar, ClipboardXIcon, RefreshCw } from "lucide-react";
import { useTranslation } from "react-i18next";
import { CustomHeaderCard } from "@/components/custom/CustomHeaderCard";
import { toFormatLocalDateString } from "@/lib/helpers/to-format-local-date-string";
import { useGetRejectionReport } from "@/tickets/hooks/useGetRejectionReport";
import { RejectionReportDetailsSkeleton } from "../Skeletons/RejectionReportDetailsSkeleton";
import { Alert, AlertAction, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export interface Props {
    ticketId: string;
}

export const RejectionReportDetails = ({ ticketId }: Props) => {
    const { t, i18n } = useTranslation();

    const { data: report, isLoading, isError, refetch, isFetching } = useGetRejectionReport(ticketId);

    if (isLoading) return <RejectionReportDetailsSkeleton />;

    if (isError) {
        return (
            <Alert variant="destructive">
                <AlertCircle />
                <AlertTitle>{t('rejection_reports.error.title')}</AlertTitle>
                <AlertDescription>
                    <span>{t('rejection_reports.error.description')}</span>
                </AlertDescription>
                <AlertAction>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => refetch()}
                        disabled={isFetching}
                    >
                        <RefreshCw className={isFetching ? 'animate-spin' : ''} />
                        {t('common.buttons.retry')}
                    </Button>
                </AlertAction>
            </Alert>
        );
    }

    if (!report) return null;

    return (
        <Card >
            <CardHeader className="gap-0">
                <CustomHeaderCard
                    title={t('rejection_reports.header.title')}
                    description={t('rejection_reports.header.description')}
                    icon={ClipboardXIcon}
                />
            </CardHeader>
            <Separator />
            <CardContent className="space-y-5">
                <CustomSectionInfo label={t('rejection_reports.sections.details')} />

                <div className="grid gap-y-5">
                    <CustomInfoRow
                        icon={<Calendar className="w-4 h-4 text-muted-foreground" />}
                        label={t('rejection_reports.data.date')}
                        value={toFormatLocalDateString(report.created_at, i18n.language)}
                    />

                    <CustomInfoRow
                        icon={<AlignLeft className="w-4 h-4 text-muted-foreground" />}
                        label={t('rejection_reports.data.justification')}
                        value={report.justification}
                    />
                </div>
            </CardContent>
        </Card>
    );
};
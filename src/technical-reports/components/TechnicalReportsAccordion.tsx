import { useTranslation } from "react-i18next";
import { PenTool, AlertCircle, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CustomHeaderCard } from "@/components/custom/CustomHeaderCard";
import { Separator } from "@/components/ui/separator";
import { TechnicalReportsAccordionSkeleton } from "./skeletons/TechnicalReportsAccordionSkeleton";
import { Alert, AlertAction, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useGetTechnicalReportsByTicketId } from "../hooks/useGetTechnicalReportByTicketId";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { DetailsTechnicalReport } from "./DetailsTechnicalReport";


export const TechnicalReportsAccordion = ({ ticketId }: { ticketId: string }) => {
    const { t } = useTranslation();
    const { data: technicalReports, isLoading, isError, refetch, isFetching } = useGetTechnicalReportsByTicketId(ticketId);

    if (isLoading) return <TechnicalReportsAccordionSkeleton />;

    if (isError) {
        return (
            <Alert variant="destructive">
                <AlertCircle />
                <AlertTitle>{t('technical_reports.error.title')}</AlertTitle>
                <AlertDescription>
                    <span>{t('technical_reports.error.description')}</span>
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

    if (!technicalReports || technicalReports.length === 0) return null;


    return (
        <Card>
            <CardHeader className="gap-0">
                <CustomHeaderCard
                    title={t('tickets.view_page.technical_reports.title')}
                    description={t('tickets.view_page.technical_reports.description')}
                    icon={PenTool}
                />
            </CardHeader>
            <Separator />
            <CardContent>
                <Accordion type="multiple" className="w-full rounded-lg border">
                    {technicalReports.map((report, index) => (
                        <AccordionItem
                            key={report.id}
                            value={report.id}
                            className="border-b px-4 last:border-b-0"
                        >
                            <AccordionTrigger>
                                {t('technical_reports.name_list')} {technicalReports.length - index}
                            </AccordionTrigger>
                            <AccordionContent>
                                <DetailsTechnicalReport technicalReport={report} />
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </CardContent>
        </Card>
    );
};
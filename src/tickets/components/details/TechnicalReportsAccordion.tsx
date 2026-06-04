import { useTranslation } from "react-i18next";
import { PenTool, Calendar, FileText, Wrench, Package, AlertCircle, RefreshCw } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CustomHeaderCard } from "@/components/custom/CustomHeaderCard";
import { useGetTechnicalReports } from "@/tickets/hooks/useGetTechnicalReport";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toFormatLocalDateString } from "@/lib/helpers/to-format-local-date-string";
import { CustomInfoRow } from "@/components/custom/CustomInfoRow";
import { TechnicalIsResolvedBadge } from "@/technical-reports/components/ui/TechnicalIsResolvedBadge";
import { TechnicalReportsAccordionSkeleton } from "../Skeletons/TechnicalReportsAccordionSkeleton";
import { Alert, AlertAction, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";


export const TechnicalReportsAccordion = ({ ticketId }: { ticketId: string }) => {
    const { t, i18n } = useTranslation();
    const { data: technicalReports, isLoading, isError, refetch, isFetching } = useGetTechnicalReports(ticketId);

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
                <Accordion type="single" collapsible className="w-full space-y-3">
                    {technicalReports.map((report, index) => (
                        <AccordionItem
                            key={report.id}
                            value={report.id}
                            className="border last:border rounded-lg px-4 "
                        >
                            <AccordionTrigger >
                                <div className="flex flex-wrap justify-between w-full gap-2">
                                    <div className="flex items-center gap-2">
                                        <Badge variant={"secondary"}>
                                            #{technicalReports.length - index}
                                        </Badge>
                                        <span className="flex items-center gap-1.5 text-muted-foreground">
                                            <Calendar className="w-4 h-4" />
                                            {toFormatLocalDateString(report.created_at, i18n.language, 'PPp')}
                                        </span>
                                    </div>

                                    <div className="flex items-center">
                                        <TechnicalIsResolvedBadge isResolved={report.is_resolved} />
                                    </div>
                                </div>
                            </AccordionTrigger>

                            <AccordionContent>
                                <div className="space-y-5">
                                    <Separator />
                                    <CustomInfoRow
                                        icon={<FileText className="w-4 h-4 text-muted-foreground" />}
                                        label={t('technical_reports.data.diagnosis')}
                                        value={report.diagnosis}
                                    />
                                    <CustomInfoRow
                                        icon={<Wrench className="w-4 h-4 text-muted-foreground" />}
                                        label={t('technical_reports.data.work_done')}
                                        value={report.work_performed}
                                    />
                                    <CustomInfoRow
                                        icon={<Package className="w-4 h-4 text-muted-foreground" />}
                                        label={t('technical_reports.data.materials_used')}
                                        value={report.materials_used || t('technical_reports.data.materials_none_used')}
                                    />
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-5">
                                        <CustomInfoRow
                                            icon={<FileText className="w-4 h-4 text-muted-foreground" />}
                                            label={t('technical_reports.data.date')}
                                            value={toFormatLocalDateString(report.created_at, i18n.language, 'PPp')}
                                        />
                                        <CustomInfoRow
                                            icon={<FileText className="w-4 h-4 text-muted-foreground" />}
                                            label={t('technical_reports.data.is_resolved.label')}
                                            value={
                                                report.is_resolved
                                                    ? t('technical_reports.data.is_resolved.true')
                                                    : t('technical_reports.data.is_resolved.false')
                                            }
                                        />
                                    </div>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </CardContent>
        </Card>
    );
};
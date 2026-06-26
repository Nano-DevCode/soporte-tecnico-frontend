import { useTranslation } from "react-i18next";
import { PenTool, Calendar, AlertCircle, RefreshCw, Eye } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CustomHeaderCard } from "@/components/custom/CustomHeaderCard";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toFormatLocalDateString } from "@/lib/helpers/to-format-local-date-string";
import { TechnicalIsResolvedBadge } from "@/technical-reports/components/ui/TechnicalIsResolvedBadge";
import { TechnicalReportsAccordionSkeleton } from "./skeletons/TechnicalReportsAccordionSkeleton";
import { Alert, AlertAction, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { Item, ItemActions, ItemContent, ItemFooter, ItemMedia, ItemTitle } from "@/components/ui/item";
import { useGetTechnicalReportsByTicketId } from "../hooks/useGetTechnicalReportByTicketId";


export const TechnicalReportsOfTicketItems = ({ ticketId }: { ticketId: string }) => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
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
            <CardContent className="space-y-2">
                {technicalReports.map((report, index) => (
                    <Item
                        variant={"outline"}
                        key={report.id}
                    >
                        <ItemMedia >
                            <Badge variant={"secondary"}>
                                #{technicalReports.length - index}
                            </Badge>
                        </ItemMedia>
                        <ItemContent>
                            <ItemTitle >
                                <span className="flex items-center gap-1.5 text-muted-foreground">
                                    <Calendar className="w-4 h-4" />
                                    {toFormatLocalDateString(report.created_at, i18n.language, 'PPp')}
                                </span>
                            </ItemTitle>
                        </ItemContent>
                        <ItemActions>
                            <Button size={"xs"} onClick={() => navigate(`/technical-reports/${report.id}`)}>
                                <Eye />
                                {t('common.buttons.view')}
                            </Button>
                        </ItemActions>
                        <ItemFooter>
                            <div className="flex flex-wrap items-center gap-2">
                                <TechnicalIsResolvedBadge isResolved={report.is_resolved} />
                                <Badge variant={"secondary"}>
                                    {report.fault_validity.name}
                                </Badge>
                            </div>
                        </ItemFooter>
                    </Item>
                ))}
            </CardContent>
        </Card>
    );
};
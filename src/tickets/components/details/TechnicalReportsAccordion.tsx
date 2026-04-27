import { useTranslation } from "react-i18next";
import { PenTool, Calendar, CheckCircle2, XCircle, FileText, Wrench, Package } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CustomHeaderCard } from "@/components/custom/CustomHeaderCard";
import { useGetTechnicalReports } from "@/tickets/hooks/useGetTechnicalReport";
import { CustomFullScreenLoading } from "@/components/custom/CustomFullScreenLoading";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toFormatLocalDateString } from "@/lib/helpers/to-format-local-date-string";
import { CustomInfoRow } from "@/components/custom/CustomInfoRow";


export const TechnicalReportsAccordion = ({ ticketId }: { ticketId: string }) => {
    const { t, i18n } = useTranslation();
    const { data: technicalReports, isLoading, isError } = useGetTechnicalReports(ticketId);

    if (isLoading) return <CustomFullScreenLoading />;

    if (isError || !technicalReports || technicalReports.length === 0) return null;


    return (
        <Card>
            <CardHeader className="gap-0">
                <CustomHeaderCard
                    title={t('tickets.technical_reports.title', 'Bitácoras')}
                    description={t('tickets.technical_reports.description', 'Historial de bitácoras generadas para este ticket.')}
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
                            {/* CABECERA DEL ACORDEÓN */}
                            <AccordionTrigger className="hover:no-underline">
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
                                        {report.is_resolved ? (
                                            <Badge>
                                                <CheckCircle2 />
                                                Solucionado
                                            </Badge>
                                        ) : (
                                            <Badge variant={"destructive"}>
                                                <XCircle />
                                                No Solucionado
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            </AccordionTrigger>

                            <AccordionContent>
                                <div className="space-y-5">
                                    <CustomInfoRow
                                        icon={<FileText className="w-4 h-4 text-muted-foreground" />}
                                        label={t('tickets.technical_reports.fields.diagnosis', 'Diagnóstico Técnico')}
                                        value={report.diagnosis}
                                    />
                                    <CustomInfoRow
                                        icon={<Wrench className="w-4 h-4 text-muted-foreground" />}
                                        label={t('tickets.technical_reports.fields.work_performed', 'Trabajo Realizado')}
                                        value={report.work_performed}
                                    />
                                    <CustomInfoRow
                                        icon={<Package className="w-4 h-4 text-muted-foreground" />}
                                        label={t('tickets.technical_reports.fields.materials_used', 'Materiales Utilizados')}
                                        value={report.materials_used || "Ninguno"}
                                    />
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </CardContent>
        </Card>
    );
};
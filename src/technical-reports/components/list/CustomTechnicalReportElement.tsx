import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
    ChevronRight,
    FileText,
    Wrench,
    FolderOpen,
    PackageSearch
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { toFormatLocalDateString } from "@/lib/helpers/to-format-local-date-string";
import { TextHighlighter } from "@/components/custom/TextHoi";
import { TechnicalIsResolvedBadge } from "../ui/TechnicalIsResolvedBadge";

export interface SimpleTicket {
    id: string;
    folio: string;
    description: string;
    issue_type: {
        name: string;
    };
    technical_reports: Array<{
        id: string;
        diagnosis: string;
        work_performed: string;
        is_resolved: boolean;
        created_at: string | Date;
    }>;
}

interface Props {
    ticket: SimpleTicket;
    searchTerm?: string;
}

export const CustomTechnicalReportElement = ({ ticket, searchTerm }: Props) => {
    const { i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(true);

    const reports = ticket.technical_reports || [];

    return (
        <div className="font-sans">
            <Collapsible open={isOpen} onOpenChange={setIsOpen}>

                <CollapsibleTrigger className="flex w-full items-start gap-2 p-2 rounded-lg hover:bg-muted/50 transition-colors text-left group">
                    <div className="shrink-0 mt-0.5">
                        <ChevronRight className={`h-5 w-5 text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-90" : ""}`} />
                    </div>
                    <div className="shrink-0 mt-0.5">
                        <FolderOpen className="h-5 w-5 text-primary/70 group-hover:text-primary transition-colors" />
                    </div>

                    <div className="flex-1 overflow-hidden">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="font-mono font-semibold text-foreground">
                                <TextHighlighter text={ticket.folio} search={searchTerm} />
                            </span>
                            <Badge variant="secondary">
                                {ticket.issue_type?.name || 'General'}
                            </Badge>
                        </div>
                        <p className="text-sm font-medium text-muted-foreground line-clamp-2">
                            <TextHighlighter text={ticket.description} search={searchTerm} />
                        </p>
                    </div>
                </CollapsibleTrigger>

                <CollapsibleContent>
                    <div className="relative ml-11 border-l-2 border-muted/60 pb-0">

                        {reports.map((report, index) => {
                            const isLast = index === reports.length - 1;

                            return (
                                <div key={report.id} className="relative pl-8 py-1 group">
                                    <div className="absolute left-0 top-7 w-8 border-t-2 border-muted/60" />

                                    {isLast && (
                                        <div className="absolute -left-1 top-7.5 bottom-0 w-1 bg-background" />
                                    )}

                                    <div className="bg-card border shadow-sm rounded-xl p-3 transition-all hover:shadow-md hover:border-primary/20">

                                        <div className="flex items-center justify-between mb-3 border-b pb-2">
                                            <div className="flex items-center gap-2">
                                                <FileText className="h-4 w-4 text-muted-foreground" />
                                                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                                    Bitácora
                                                </span>
                                            </div>
                                            <div className="flex flex-wrap-reverse items-center justify-end gap-2">
                                                <span className="text-[11px] text-muted-foreground">
                                                    {toFormatLocalDateString(report.created_at, i18n.language, "dd MMM yyyy, HH:mm")}
                                                </span>
                                                <TechnicalIsResolvedBadge isResolved={report.is_resolved} />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                                                    <PackageSearch className="h-3.5 w-3.5" />
                                                    Diagnóstico
                                                </div>
                                                <p className="text-sm text-foreground leading-relaxed line-clamp-2">
                                                    <TextHighlighter text={report.diagnosis} search={searchTerm} />
                                                </p>
                                            </div>

                                            <div className="space-y-1.5">
                                                <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                                                    <Wrench className="h-3.5 w-3.5" />
                                                    Trabajo Realizado
                                                </div>
                                                <p className="text-sm text-foreground leading-relaxed line-clamp-2">
                                                    <TextHighlighter text={report.work_performed} search={searchTerm} />
                                                </p>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            );
                        })}

                        {reports.length === 0 && (
                            <div className="relative pl-8 py-3">
                                <div className="absolute left-0 top-7 w-6 border-t-2 border-muted/60" />
                                <div className="absolute -left-0.5 top-7.25 bottom-0 w-1 bg-background" />
                                <div className="text-sm text-muted-foreground italic bg-muted/20 px-4 py-2 rounded-lg border border-dashed inline-block">
                                    No hay intervenciones registradas.
                                </div>
                            </div>
                        )}
                    </div>
                </CollapsibleContent>
            </Collapsible>
        </div>
    );
};
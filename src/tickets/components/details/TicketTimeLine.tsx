import React from "react";
import {
    CheckCircle2,
    Clock,
    FileText,
    Lock,
    Route,
    UserPlus,
    Wrench,
    XCircle,
    AlertCircle,
    Flag,
    Archive,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { toFormatLocalDateString } from "@/lib/helpers/to-format-local-date-string";
import { cn } from "@/lib/utils";
import type { TicketStatusCode } from "../../interfaces/ticket-status-code.interface";
import type { TicketHistory } from "../../interfaces/ticket-details.response";
import { Separator } from "@/components/ui/separator";
import { CustomHeaderCard } from "@/components/custom/CustomHeaderCard";
import { useTranslation } from "react-i18next";

const TIMELINE_CONFIG: Record<TicketStatusCode, { icon: React.ElementType, bg: string, text: string }> = {
    RECIBIDA: { icon: FileText, bg: 'bg-blue-100', text: 'text-blue-600' },
    RECHAZADA: { icon: XCircle, bg: 'bg-red-100', text: 'text-red-600' },
    CANALIZADA: { icon: Route, bg: 'bg-purple-100', text: 'text-purple-600' },
    ASIGNADA: { icon: UserPlus, bg: 'bg-indigo-100', text: 'text-indigo-600' },
    ATENDIENDO: { icon: Wrench, bg: 'bg-amber-100', text: 'text-amber-600' },
    SOLUCIONADA: { icon: CheckCircle2, bg: 'bg-green-100', text: 'text-green-600' },
    NO_SOLUCIONADA: { icon: AlertCircle, bg: 'bg-orange-100', text: 'text-orange-600' },
    FINALIZADA: { icon: Flag, bg: 'bg-emerald-100', text: 'text-emerald-600' },
    CERRADA: { icon: Lock, bg: 'bg-slate-100', text: 'text-slate-600' },
    ARCHIVADA: { icon: Archive, bg: 'bg-gray-100', text: 'text-gray-600' },
};

function TimelineIcon({ code }: { code: TicketStatusCode }) {
    const config = TIMELINE_CONFIG[code] || TIMELINE_CONFIG.RECIBIDA;
    const Icon = config.icon;

    return (
        <div className={cn(
            "relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full sm:h-10 sm:w-10",
            config.bg
        )}>
            <Icon className={cn("h-4 w-4 sm:h-5 sm:w-5", config.text)} />
        </div>
    );
}

interface Props {
    ticket_histories: TicketHistory[]
}

export const TicketTimeLine = ({ ticket_histories }: Props) => {
    const { t, i18n } = useTranslation()
    if (!ticket_histories || ticket_histories.length === 0) return null;

    return (
        <Card>
            <CardHeader className="gap-0">
                <CustomHeaderCard
                    title={t('tickets.view_page.timeline.title')}
                    description={t('tickets.view_page.timeline.description')}
                />
            </CardHeader>
            <Separator />
            <CardContent>
                {ticket_histories.map((historial, idx) => {
                    const isLastItem = idx === ticket_histories.length - 1;

                    return (
                        <div key={historial.id} className="relative flex gap-4">

                            {!isLastItem && (
                                <div className="absolute left-4.5 sm:left-5 top-9 bottom-0 w-px bg-muted-foreground -ml-px" />
                            )}

                            <TimelineIcon code={historial.status.code} />

                            <div className={cn("flex flex-col min-w-0 gap-1", !isLastItem && "pb-8")}>
                                <h3 className="text-sm font-semibold text-foreground uppercase leading-tight truncate">
                                    {historial.status.name}
                                </h3>

                                <div className="flex items-center text-xs sm:text-sm text-muted-foreground">
                                    <Clock className="mr-1.5 h-3.5 w-3.5 shrink-0" />
                                    <span className="truncate">
                                        {toFormatLocalDateString(historial.created_at, i18n.language)}
                                    </span>
                                </div>
                            </div>

                        </div>
                    );
                })}
            </CardContent>
        </Card>
    );
};
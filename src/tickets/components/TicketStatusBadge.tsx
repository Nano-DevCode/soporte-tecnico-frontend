import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { TicketStatusCode } from "../interfaces/ticket-status-code.interface";
import { useTranslation } from "react-i18next";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { TicketStatusColors } from "../utils/ticket-status-colors";

// const STATUS_CONFIG: Record<TicketStatusCode, { className: string }> = {
//     RECIBIDA: {
//         className: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-500/10 dark:text-slate-400 dark:border-slate-500/20',
//     },
//     RECHAZADA: {
//         className: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20',
//     },
//     CANALIZADA: {
//         className: 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20',
//     },
//     ASIGNADA: {
//         className: 'bg-cyan-100 text-cyan-700 border-cyan-200 dark:bg-cyan-500/10 dark:text-cyan-400 dark:border-cyan-500/20',
//     },
//     ATENDIENDO: {
//         className: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20',
//     },
//     // PAUSADA: {
//     //     className: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20',
//     // },
//     SOLUCIONADA: {
//         className: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20',
//     },
//     NO_SOLUCIONADA: {
//         className: 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20',
//     },
//     FINALIZADA: {
//         className: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20',
//     },
//     CERRADA: {
//         className: 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-500/10 dark:text-yellow-400 dark:border-yellow-500/20',
//     },
//     ARCHIVADA: {
//         className: 'bg-rose-100 text-rose-600 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20',
//     },
// };

const FALLBACK_CONFIG = {
    className: 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700',
};

interface Props {
    statusCode: TicketStatusCode | string;
    className?: string;
}

export const TicketStatusBadge = ({ statusCode, className }: Props) => {
    const config = TicketStatusColors[statusCode as TicketStatusCode] || FALLBACK_CONFIG;

    const { t } = useTranslation();

    type StatusNameTranslationKey = `tickets.status.${TicketStatusCode}.name`;
    type StatusDescTranslationKey = `tickets.status.${TicketStatusCode}.description`;

    const currentStatus = statusCode as TicketStatusCode;

    return (
        <Tooltip>
            <TooltipTrigger asChild className="w-fit cursor-help">
                <Badge
                    className={cn(
                        "font-semibold px-2.5 py-0.5 uppercase tracking-wider text-[10px] sm:text-xs",
                        config,
                        className
                    )}
                >
                    {t(`tickets.status.${currentStatus}.name` as StatusNameTranslationKey) || t('tickets.status.UNKNOWN.name')}
                </Badge>
            </TooltipTrigger>
            <TooltipContent side="left" className="max-w-62.5 text-center">
                <p className="text-sm">
                    {t(`tickets.status.${currentStatus}.description` as StatusDescTranslationKey) || t('tickets.status.UNKNOWN.description')}
                </p>
            </TooltipContent>
        </Tooltip>

    );
};
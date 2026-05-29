import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { AlertOctagon, AlertTriangle, Clock, Info } from "lucide-react";
import type { TicketPriorityLevel } from "../interfaces/ticket-priority-level.type";

const PRIORITY_CONFIG: Record<TicketPriorityLevel, { className: string, icon: React.ElementType }> = {
    1: {
        className: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20',
        icon: AlertOctagon,
    },
    2: {
        className: 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20',
        icon: AlertTriangle,
    },
    3: {
        className: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20',
        icon: Clock,
    },
    4: {
        className: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-500/10 dark:text-slate-400 dark:border-slate-500/20',
        icon: Info,
    },
};

const FALLBACK_CONFIG = {
    className: 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700',
    icon: Info,
};

interface Props {
    priority: number;
    className?: string;
    showIcon?: boolean;
}

export const TicketPriorityBadge = ({ priority, className, showIcon = true }: Props) => {
    const { t } = useTranslation();

    const isValidPriority = priority === 1 || priority === 2 || priority === 3 || priority === 4;
    const config = isValidPriority
        ? PRIORITY_CONFIG[priority as TicketPriorityLevel]
        : FALLBACK_CONFIG;

    const Icon = config.icon;


    type PriorityNameTranslationKey = `tickets.priority.${TicketPriorityLevel}.name`;
    type PriorityDescTranslationKey = `tickets.priority.${TicketPriorityLevel}.description`;

    const currentPriority = priority as TicketPriorityLevel;

    return (
        <Tooltip>
            <TooltipTrigger asChild className="w-fit cursor-help">
                <Badge
                    className={cn(
                        "font-semibold px-2.5 py-0.5 tracking-wider text-[10px] sm:text-xs items-center uppercase",
                        config.className,
                        className
                    )}
                >
                    {showIcon && <Icon />}
                    {isValidPriority
                        ? t(`tickets.priority.${currentPriority}.name` as PriorityNameTranslationKey)
                        : t('tickets.priority.UNKNOWN.name', 'Desconocida')}
                </Badge>
            </TooltipTrigger>
            <TooltipContent side="left" className="max-w-xs text-center">
                <p className="text-sm">
                    {isValidPriority
                        ? t(`tickets.priority.${currentPriority}.description` as PriorityDescTranslationKey)
                        : t('tickets.priority.UNKNOWN.description', 'Prioridad no asignada')}
                </p>
            </TooltipContent>
        </Tooltip>
    );
};
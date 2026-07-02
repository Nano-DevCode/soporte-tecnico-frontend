import { TicketStatus, type TicketStatusType } from "./ticket-state-machine";

export const TicketStatusColors: Record<TicketStatusType, string> = {
    [TicketStatus.IDLE]:
        'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-500/10 dark:text-gray-400 dark:border-gray-500/20',
    [TicketStatus.RECIBIDA]:
        'bg-sky-100 text-sky-700 border-sky-200 dark:bg-sky-500/10 dark:text-sky-400 dark:border-sky-500/20',
    [TicketStatus.RECHAZADA]:
        'bg-red-100 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20',
    [TicketStatus.CANALIZADA]:
        'bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20',
    [TicketStatus.ASIGNADA]:
        'bg-teal-100 text-teal-700 border-teal-200 dark:bg-teal-500/10 dark:text-teal-400 dark:border-teal-500/20',
    [TicketStatus.ATENDIENDO]:
        'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20',
    [TicketStatus.SOLUCIONADA]:
        'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20',
    [TicketStatus.NO_SOLUCIONADA]:
        'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20',
    [TicketStatus.FINALIZADA]:
        'bg-lime-100 text-lime-700 border-lime-200 dark:bg-lime-500/10 dark:text-lime-400 dark:border-lime-500/20',
    [TicketStatus.CERRADA]:
        'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-500/10 dark:text-slate-400 dark:border-slate-500/20',
    [TicketStatus.ARCHIVADA]:
        'bg-zinc-200 text-zinc-500 border-zinc-300 dark:bg-zinc-500/10 dark:text-zinc-500 dark:border-zinc-500/20',
};
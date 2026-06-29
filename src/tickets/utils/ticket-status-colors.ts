import { TicketStatus, type TicketStatusType } from "./ticket-state-machine";

export const TicketStatusColors: Record<TicketStatusType, string> = {
    [TicketStatus.IDLE]: 'bg-gray-100 text-gray-700 border-gray-200',
    [TicketStatus.RECIBIDA]: 'bg-sky-100 text-sky-700 border-sky-200',
    [TicketStatus.RECHAZADA]: 'bg-red-100 text-red-700 border-red-200',
    [TicketStatus.CANALIZADA]: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    [TicketStatus.ASIGNADA]: 'bg-teal-100 text-teal-700 border-teal-200',
    [TicketStatus.ATENDIENDO]: 'bg-blue-100 text-blue-700 border-blue-200',
    [TicketStatus.SOLUCIONADA]: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    [TicketStatus.NO_SOLUCIONADA]: 'bg-orange-100 text-orange-700 border-orange-200',
    [TicketStatus.FINALIZADA]: 'bg-lime-100 text-lime-700 border-lime-200',
    [TicketStatus.CERRADA]: 'bg-slate-100 text-slate-700 border-slate-200',
    [TicketStatus.ARCHIVADA]: 'bg-zinc-200 text-zinc-500 border-zinc-300',
};
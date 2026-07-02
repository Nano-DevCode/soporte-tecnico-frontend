import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";
import { t } from "i18next"
// --- CONSTANTS ---
export const TicketStatus = {
    IDLE: 'IDLE' as const,
    RECIBIDA: 'RECIBIDA' as const,
    RECHAZADA: 'RECHAZADA' as const,
    CANALIZADA: 'CANALIZADA' as const,
    ASIGNADA: 'ASIGNADA' as const,
    ATENDIENDO: 'ATENDIENDO' as const,
    SOLUCIONADA: 'SOLUCIONADA' as const,
    NO_SOLUCIONADA: 'NO_SOLUCIONADA' as const,
    PAUSADA: 'PAUSADA' as const,
    FINALIZADA: 'FINALIZADA' as const,
    CERRADA: 'CERRADA' as const,
    ARCHIVADA: 'ARCHIVADA' as const,
} as const;

export type TicketStatus = typeof TicketStatus[keyof typeof TicketStatus];
export interface Tickets {
    id: string;
    name: string;
    folio: string | number;
    status_code: TicketStatus;
    description?: string;
    created_at?: string;
    updated_at?: string;
}

export interface TicketsResponse {
    data: Tickets[];
    meta: {
        total: number;
        page: number;
        lastPage: number;
    };
}

export interface Options {
    limit?: number | string;
    offset?: number | string;
    query?: string;
}

export const getTicketsAction = async (options: Options = {}): Promise<TicketsResponse> => {
    const { limit = 10, query = undefined } = options;
    try {
        const { data } = await soporteTecnicoApi.get<TicketsResponse>('/tickets/all/paginated', {
            params: {
                limit: isNaN(Number(limit)) ? 10 : Number(limit),
                search: query?.replaceAll('+', ' '),
            },
        });
        const mappedData = data.data.map((ticket: Tickets) => ({
            ...ticket,
            name: `${ticket.folio || ''} - ${t('tickets.status.label_status')} ${ticket.status_code || ''}`.trim()
        }));
        return {
            ...data,
            data: mappedData
        };
    } catch {
        return {
            data: [],
            meta: {
                total: 0,
                page: 1,
                lastPage: 1,
            },
        };
    }
};
export const getTicketsByIdAction = async (
    idOrObject: string | { id: string }
): Promise<Tickets | null> => {
    const id = typeof idOrObject === 'object' ? idOrObject?.id : idOrObject;

    if (!id) return null;

    try {
        const { data } = await soporteTecnicoApi.get<Tickets>(`/tickets/${id}`);

        if (data) {
            return {
                ...data,
                name: `${data.folio || ''} / ${data.status_code || ''}`.trim()
            };
        }
        return data;
    } catch {
        return null;
    }
};
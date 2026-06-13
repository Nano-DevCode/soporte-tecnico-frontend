import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";
import { t } from "i18next";

// --- INTERFACES ---
export interface Tickets {
    id: string;
    name: string;
    folio: string | number;
    description?: string;
    created_at?: string;
    updated_at?: string;
}

export interface TicketsResponse {
    // Debe coincidir exactamente con la clave que tu backend use en el JSON paginado
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
        const { data } = await soporteTecnicoApi.get<TicketsResponse>('/tickets', {
            params: {
                limit: isNaN(Number(limit)) ? 10 : Number(limit),
                search: query?.replaceAll('+', ' '),
            },
        });
        const mappedData = data.data.map((ticket: Tickets) => ({
            ...ticket,
            name: `Ticket: ${ticket.folio || ''}`.trim()
        }));

        return {
            ...data,
            data: mappedData // Devolvemos los tickets ya con su propiedad 'name' integrada
        };

    } catch (error) {
        console.error(t("api_tickets_fetch_error"), error);
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
                name: `Ticket: ${data.folio}${data.description ? ` - ${data.description}` : ''}`.trim()
            };
        }
        return data;
    } catch (error) {
        console.error(`${t("api_tickets_by_id_error")} ${id}:`, error);
        return null;
    }
};
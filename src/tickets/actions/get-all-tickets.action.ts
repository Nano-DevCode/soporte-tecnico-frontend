import { soporteTecnicoApi } from "@/api/soporteTecnicoApi"
import type { TicketsResponse } from "../interfaces/tickets.response";

interface Options {
    limit?: number | string;
    page?: number | string;
    query?: string;
    sortBy?: string;
    sortOrder?: string;
}

export const getAllTicketsAction = async (options: Options): Promise<TicketsResponse> => {
    const { limit = 10, page = 1, query, sortBy, sortOrder } = options;
    const parsedLimit = Number(limit);
    const parsedPage = Number(page);

    const { data } = await soporteTecnicoApi.get<TicketsResponse>('/tickets',
        {
            params: {
                limit: isNaN(parsedLimit) || parsedLimit < 1 ? 10 : parsedLimit,
                page: isNaN(parsedPage) || parsedPage < 1 ? 1 : parsedPage,
                search: query,
                sortBy: sortBy,
                sortOrder: sortOrder,
            },
        }
    );
    return data;
}
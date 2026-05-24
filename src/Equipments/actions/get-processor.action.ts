import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";
import { t } from "i18next";

// --- INTERFACES ---
export interface Processor {
    id: string;
    brand: string;
    model: string;
    description: string;
    created_at?: string;
    updated_at?: string;
}
export interface UIProcessor extends Processor {
    name: string;
}

export interface ProcessorsResponse {
    processors: Processor[];
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

export const getProcessorsAction = async (options: Options = {}): Promise<ProcessorsResponse> => {
    const { limit = 10, offset = 0, query = undefined } = options;

    try {
        const { data } = await soporteTecnicoApi.get<ProcessorsResponse>('/computerprocessors', {
            params: {
                limit: isNaN(Number(limit)) ? 10 : Number(limit),
                offset: isNaN(Number(offset)) ? 0 : Number(offset),
                query: query?.replaceAll('+', ' '),
            },
        });

        return data;
    } catch (error) {
        console.error(t("api_processors_fetch_error"), error);
        return {
            processors: [],
            meta: {
                total: 0,
                page: 1,
                lastPage: 1,
            },
        };
    }
};

export const getProcessorByIdAction = async (
    idOrObject: string | { id: string }
): Promise<UIProcessor | null> => {
    const id = typeof idOrObject === 'object' ? idOrObject?.id : idOrObject;
    if (!id) return null;
    try {
        const { data } = await soporteTecnicoApi.get<Processor>(`/computerprocessors/${id}`);
        if (!data) return null;
        return {
            ...data,
            name: `${data.brand || ''} ${data.model || ''} ${data.description || ''}`.trim()
        };
    } catch (error) {
        console.error(`${t("api_processor_by_id_error")} ${id}:`, error);
        return null;
    }
};
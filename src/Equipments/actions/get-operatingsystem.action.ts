import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";
import { t } from "i18next";

// --- INTERFACES ---
export interface OperatingSystem {
    id: string;
    name: string;
    created_at?: string;
    updated_at?: string;
}

export interface OperatingSystemsResponse {
    // Debe coincidir exactamente con la clave que tu backend retorne en su JSON paginado
    operatingSystems: OperatingSystem[];
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

// --- ACCIONES ---

/**
 * Obtiene los sistemas operativos de forma paginada y con filtros de búsqueda.
 */
export const getOperatingSystemsAction = async (options: Options = {}): Promise<OperatingSystemsResponse> => {
    const { limit = 10, offset = 0, query = undefined } = options;

    try {
        const { data } = await soporteTecnicoApi.get<OperatingSystemsResponse>('/operatingsystems', {
            params: {
                limit: isNaN(Number(limit)) ? 10 : Number(limit),
                offset: isNaN(Number(offset)) ? 0 : Number(offset),
                query: query?.replaceAll('+', ' '),
            },
        });

        return data;
    } catch (error) {
        console.error(t("api_operating_systems_fetch_error"), error);
        return {
            operatingSystems: [],
            meta: {
                total: 0,
                page: 1,
                lastPage: 1,
            },
        };
    }
};

export const getOperatingSystemByIdAction = async (
    idOrObject: string | { id: string }
): Promise<OperatingSystem | null> => {
    const id = typeof idOrObject === 'object' ? idOrObject?.id : idOrObject;

    if (!id) return null;
    try {
        const { data } = await soporteTecnicoApi.get<OperatingSystem>(`/operatingsystems/${id}`);
        return data;
    } catch (error) {
        console.error(`${t("api_operating_system_by_id_error")} ${id}:`, error);
        return null;
    }
};
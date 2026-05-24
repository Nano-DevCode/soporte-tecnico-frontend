import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";
import { t } from "i18next";

// --- INTERFACES ---
export interface TypeStorage {
    id: string;
    name: string;
    created_at?: string;
    updated_at?: string;
}

export interface TypeStoragesResponse {
    typeStorages: TypeStorage[];
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

export const getTypeStoragesAction = async (options: Options = {}): Promise<TypeStoragesResponse> => {
    const { limit = 10, offset = 0, query = undefined } = options;

    try {
        const { data } = await soporteTecnicoApi.get<TypeStoragesResponse>('/storagetypes', {
            params: {
                limit: isNaN(Number(limit)) ? 10 : Number(limit),
                offset: isNaN(Number(offset)) ? 0 : Number(offset),
                query: query?.replaceAll('+', ' '),
            },
        });

        return data;
    } catch (error) {
        console.error(t("api_storages_fetch_error"), error);
        return {
            typeStorages: [],
            meta: {
                total: 0,
                page: 1,
                lastPage: 1,
            },
        };
    }
};

export const getTypeStorageByIdAction = async (
    idOrObject: string | { id: string }
): Promise<TypeStorage | null> => {
    // Extracción segura del ID en base al tipo de argumento recibido
    const id = typeof idOrObject === 'object' ? idOrObject?.id : idOrObject;

    if (!id) return null;

    try {
        const { data } = await soporteTecnicoApi.get<TypeStorage>(`/storagetypes/${id}`);
        return data;
    } catch (error) {
        console.error(`${t("api_storage_by_id_error")} ${id}:`, error);
        return null;
    }
};
import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";
import { t } from "i18next";

// --- INTERFACES ---
export interface TypeConsumable {
    id: string;
    name: string;
    created_at?: string;
    updated_at?: string;
}

export interface TypeConsumableResponse {
    // Debe coincidir exactamente con la clave que tu backend use en el JSON paginado
    typeConsumables: TypeConsumable[];
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

export const getTypeConsumablesAction = async (options: Options = {}): Promise<TypeConsumableResponse> => {
    const { limit = 10, offset = 0, query = undefined } = options;

    try {
        const { data } = await soporteTecnicoApi.get<TypeConsumableResponse>('/type-consumables', {
            params: {
                limit: isNaN(Number(limit)) ? 10 : Number(limit),
                offset: isNaN(Number(offset)) ? 0 : Number(offset),
                query: query?.replaceAll('+', ' '),
            },
        });

        return data;
    } catch (error) {
        console.error(t("api_type_consumables_fetch_error"), error);
        return {
            typeConsumables: [],
            meta: {
                total: 0,
                page: 1,
                lastPage: 1,
            },
        };
    }
};

export const getTypeConsumableByIdAction = async (
    idOrObject: string | { id: string }
): Promise<TypeConsumable | null> => {
    // Extracción segura del ID en base al tipo de argumento recibido
    const id = typeof idOrObject === 'object' ? idOrObject?.id : idOrObject;

    if (!id) return null;

    try {
        const { data } = await soporteTecnicoApi.get<TypeConsumable>(`/type-consumables/${id}`);
        return data;
    } catch (error) {
        console.error(`${t("api_type_consumable_by_id_error")} ${id}:`, error);
        return null; // Retorno seguro para evitar excepciones no controladas en el Front
    }
};
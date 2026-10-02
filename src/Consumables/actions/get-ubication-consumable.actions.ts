import { soporteTecnicoApi } from "../../api/soporteTecnicoApi";

// --- INTERFACES ---
export interface UbicationConsumable {
    id: string;
    name: string;
    created_at?: string;
    updated_at?: string;
}

export interface UbicationConsumableResponse {
    // Debe coincidir exactamente con la clave que tu backend use en el JSON paginado
    ubicationConsumables: UbicationConsumable[];
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

export const getUbicationConsumablesAction = async (options: Options = {}): Promise<UbicationConsumableResponse> => {
    const { limit = 10, offset = 0, query = undefined } = options;

    try {
        const { data } = await soporteTecnicoApi.get<UbicationConsumableResponse>('/consumable-ubications', {
            params: {
                limit: isNaN(Number(limit)) ? 10 : Number(limit),
                offset: isNaN(Number(offset)) ? 0 : Number(offset),
                query: query?.replaceAll('+', ' '),
            },
        });

        return data;
    } catch {
        // console.error(t("api_ubication_consumables_fetch_error"), error);
        return {
            ubicationConsumables: [],
            meta: {
                total: 0,
                page: 1,
                lastPage: 1,
            },
        };
    }
};

export const getUbicationConsumableByIdAction = async (
    idOrObject: string | { id: string }
): Promise<UbicationConsumable | null> => {
    // Extracción segura del ID en base al tipo de argumento recibido
    const id = typeof idOrObject === 'object' ? idOrObject?.id : idOrObject;

    if (!id) return null;

    try {
        const { data } = await soporteTecnicoApi.get<UbicationConsumable>(`/consumable-ubications/${id}`);
        return data;
    } catch {
        // console.error(`${t("api_ubication_consumable_by_id_error")} ${id}:`, error);
        return null; // Retorno seguro para evitar excepciones no controladas en el Front
    }
};
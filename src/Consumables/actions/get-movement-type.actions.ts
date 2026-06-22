import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";
//import { t } from "i18next";

// --- INTERFACES ---
export interface MovementType {
    id: string;
    name: string;
    created_at?: string;
    updated_at?: string;
}

export interface MovementTypeResponse {
    // Debe coincidir exactamente con la clave que tu backend use en el JSON paginado
    movementTypes: MovementType[];
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

export const getMovementTypesAction = async (options: Options = {}): Promise<MovementTypeResponse> => {
    const { limit = 10, offset = 0, query = undefined } = options;

    try {
        const { data } = await soporteTecnicoApi.get<MovementTypeResponse>('/movement-types', {
            params: {
                limit: isNaN(Number(limit)) ? 10 : Number(limit),
                offset: isNaN(Number(offset)) ? 0 : Number(offset),
                query: query?.replaceAll('+', ' '),
            },
        });

        return data;
    } catch {
        //console.error(t("api_movement_types_fetch_error"), error);
        return {
            movementTypes: [],
            meta: {
                total: 0,
                page: 1,
                lastPage: 1,
            },
        };
    }
};

export const getMovementTypeByIdAction = async (
    idOrObject: string | { id: string }
): Promise<MovementType | null> => {
    // Extracción segura del ID en base al tipo de argumento recibido
    const id = typeof idOrObject === 'object' ? idOrObject?.id : idOrObject;

    if (!id) return null;

    try {
        const { data } = await soporteTecnicoApi.get<MovementType>(`/movement-types/${id}`);
        return data;
    } catch {
        // console.error(`${t("api_movement_type_by_id_error")} ${id}:`, error);
        return null; // Retorno seguro para evitar excepciones no controladas en el Front
    }
};
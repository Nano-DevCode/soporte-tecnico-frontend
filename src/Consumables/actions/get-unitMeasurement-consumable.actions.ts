import { soporteTecnicoApi } from "../../api/soporteTecnicoApi";

// --- INTERFACES ---
export interface UnitMeasurementConsumable {
    id: string;
    name: string;
    created_at?: string;
    updated_at?: string;
}

export interface UnitMeasurementConsumableResponse {
    // Debe coincidir exactamente con la clave que tu backend use en el JSON paginado
    unitMeasurementConsumables: UnitMeasurementConsumable[];
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

export const getUnitMeasurementConsumablesAction = async (options: Options = {}): Promise<UnitMeasurementConsumableResponse> => {
    const { limit = 10, offset = 0, query = undefined } = options;

    try {
        const { data } = await soporteTecnicoApi.get<UnitMeasurementConsumableResponse>('/unit-measurements', {
            params: {
                limit: isNaN(Number(limit)) ? 10 : Number(limit),
                offset: isNaN(Number(offset)) ? 0 : Number(offset),
                query: query?.replaceAll('+', ' '),
            },
        });

        return data;
    } catch {
        // console.error(t("api_unit_measurement_consumables_fetch_error"), error);
        return {
            unitMeasurementConsumables: [],
            meta: {
                total: 0,
                page: 1,
                lastPage: 1,
            },
        };
    }
};

export const getUnitMeasurementConsumableByIdAction = async (
    idOrObject: string | { id: string }
): Promise<UnitMeasurementConsumable | null> => {
    // Extracción segura del ID en base al tipo de argumento recibido
    const id = typeof idOrObject === 'object' ? idOrObject?.id : idOrObject;

    if (!id) return null;

    try {
        const { data } = await soporteTecnicoApi.get<UnitMeasurementConsumable>(`/unit-measurements/${id}`);
        return data;
    } catch {
        // console.error(`${t("api_unit_measurement_consumable_by_id_error")} ${id}:`, error);
        return null; // Retorno seguro para evitar excepciones no controladas en el Front
    }
};
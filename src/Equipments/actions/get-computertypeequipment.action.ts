import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";
import { t } from "i18next";

// --- INTERFACES ---
export interface ComputerTypeEquipment {
    id: string;
    name: string;
    created_at?: string;
    updated_at?: string;
}

export interface ComputerTypeEquipmentsResponse {
    computerTypeEquipments: ComputerTypeEquipment[];
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

export const getComputerTypeEquipmentsAction = async (
    options: Options = {}
): Promise<ComputerTypeEquipmentsResponse> => {
    const { limit = 10, offset = 0, query = undefined } = options;

    try {
        const { data } = await soporteTecnicoApi.get<ComputerTypeEquipmentsResponse>('/computerequipmenttypes', {
            params: {
                limit: isNaN(Number(limit)) ? 10 : Number(limit),
                offset: isNaN(Number(offset)) ? 0 : Number(offset),
                // Sanitización para cadenas codificadas en URLs con buscadores reactivos
                query: query?.replaceAll('+', ' '),
            },
        });

        return data;
    } catch (error) {
        console.error(t("api_computer_types_fetch_error"), error);

        // Retorno estructuralmente seguro para evitar fallos de lectura de propiedades en cascada (UI)
        return {
            computerTypeEquipments: [],
            meta: {
                total: 0,
                page: 1,
                lastPage: 1,
            },
        };
    }
};

export const getComputerTypeEquipmentByIdAction = async (
    idOrObject: string | { id: string }
): Promise<ComputerTypeEquipment | null> => {
    // Extracción segura del ID resolviendo el tipo de argumento
    const id = typeof idOrObject === 'object' ? idOrObject?.id : idOrObject;

    if (!id) return null;

    try {
        const { data } = await soporteTecnicoApi.get<ComputerTypeEquipment>(`/computerequipmenttypes/${id}`);
        return data;
    } catch (error) {
        console.error(`${t("api_computer_types_by_id_error")} ${id}:`, error);
        return null; 
    }
};
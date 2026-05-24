import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";
import { t } from "i18next";

// --- INTERFACES ---
export interface Responsible {
    id: string; // Cambiado a obligatorio para consistencia con los datos que vienen del Backend
    num_employe: string;
    name: string;
    first_name: string;
    last_name: string;
    area: string;
    mail: string;
    created_at?: string;
    updated_at?: string;
}

// Interfaz extendida para la UI que incluye el nombre completo calculado
export interface UIResponsible {
    id: string;
    name: string;
}

export interface ResponsiblesResponse {
    // Debe coincidir exactamente con la propiedad que envía tu Backend en su JSON paginado
    responsibles: Responsible[];
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
 * Obtiene la lista de responsables de forma paginada y con filtros de búsqueda.
 */
export const getResponsiblesAction = async (options: Options = {}): Promise<ResponsiblesResponse> => {
    const { limit = 10, offset = 0, query = undefined } = options;

    try {
        const { data } = await soporteTecnicoApi.get<ResponsiblesResponse>('/responsibleequipments', {
            params: {
                limit: isNaN(Number(limit)) ? 10 : Number(limit),
                offset: isNaN(Number(offset)) ? 0 : Number(offset),
                query: query?.replaceAll('+', ' '),
            },
        });

        return data;
    } catch (error) {
        console.error(t("api_responsibles_fetch_error"), error);

        // Retorno estructuralmente seguro para evitar fallos de lectura de propiedades en la UI (.map(), etc.)
        return {
            responsibles: [],
            meta: {
                total: 0,
                page: 1,
                lastPage: 1,
            },
        };
    }
};

export const getResponsibleByIdAction = async (
    idOrObject: string | { id: string }
): Promise<UIResponsible | null> => {
    // Extracción segura del ID resolviendo el tipo de argumento
    const id = typeof idOrObject === 'object' ? idOrObject?.id : idOrObject;

    if (!id) return null;

    try {
        const { data } = await soporteTecnicoApi.get<Responsible>(`/responsibleequipments/${id}`);

        if (!data) return null;

        // Retornamos el objeto adaptado inyectando la concatenación del nombre completo
        return {
            id: data.id,
            name: `${data.name || ''} ${data.first_name || ''} ${data.last_name || ''}`.trim()
        };
    } catch (error) {
        console.error(`${t("api_responsible_by_id_error")} ${id}:`, error);
        return null; // Evita excepciones no controladas en el ciclo de vida de los componentes
    }
};
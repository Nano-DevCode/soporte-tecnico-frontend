import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";
// import { t } from "i18next";

// --- INTERFACES ---
export interface TypeNetwork {
    id: string;
    name: string;
    created_at?: string;
    updated_at?: string;
}

export interface TypeNetworksResponse {
    // Debe coincidir exactamente con la clave que tu backend use en el JSON paginado
    typeNetworks: TypeNetwork[];
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

export const getNetworkTypesAction = async (options: Options = {}): Promise<TypeNetworksResponse> => {
    const { limit = 10, offset = 0, query = undefined } = options;

    try {
        const { data } = await soporteTecnicoApi.get<TypeNetworksResponse>('/typenetworks', {
            params: {
                limit: isNaN(Number(limit)) ? 10 : Number(limit),
                offset: isNaN(Number(offset)) ? 0 : Number(offset),
                query: query?.replaceAll('+', ' '),
            },
        });

        return data;
    } catch (error) {
        // console.error(t("api_network_types_fetch_error"), error);
        void error;
        return {
            typeNetworks: [],
            meta: {
                total: 0,
                page: 1,
                lastPage: 1,
            },
        };
    }
};

export const getNetworkTypeByIdAction = async (
    idOrObject: string | { id: string }
): Promise<TypeNetwork | null> => {
    // Extracción segura del ID en base al tipo de argumento recibido
    const id = typeof idOrObject === 'object' ? idOrObject?.id : idOrObject;

    if (!id) return null;

    try {
        const { data } = await soporteTecnicoApi.get<TypeNetwork>(`/typenetworks/${id}`);
        return data;
    } catch (error) {
        // console.error(`${t("api_network_type_by_id_error")} ${id}:`, error);
        void error;
        return null; // Retorno seguro para evitar excepciones no controladas en el Front
    }
};
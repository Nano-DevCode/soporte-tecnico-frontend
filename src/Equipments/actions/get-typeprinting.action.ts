import { soporteTecnicoApi } from "../../api/soporteTecnicoApi";
// import { t } from "i18next";

// --- INTERFACES ---
export interface TypePrinting {
    id: string;
    name: string;
    created_at?: string;
    updated_at?: string;
}

export interface TypePrintingsResponse {
    // Debe coincidir con la clave que envía tu backend en su JSON paginado
    typePrintings: TypePrinting[];
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

export const getTypePrintingsAction = async (options: Options = {}): Promise<TypePrintingsResponse> => {
    const { limit = 10, offset = 0, query = undefined } = options;

    try {
        const { data } = await soporteTecnicoApi.get<TypePrintingsResponse>('/printingtypes', {
            params: {
                limit: isNaN(Number(limit)) ? 10 : Number(limit),
                offset: isNaN(Number(offset)) ? 0 : Number(offset),
                query: query?.replaceAll('+', ' '),
            },
        });

        return data;
    } catch (error) {
        // console.error(t("api_printing_types_fetch_error"), error);
        void error;
        return {
            typePrintings: [],
            meta: {
                total: 0,
                page: 1,
                lastPage: 1,
            },
        };
    }
};
export const getTypePrintingByIdAction = async (
    idOrObject: string | { id: string }
): Promise<TypePrinting | null> => {
    const id = typeof idOrObject === 'object' ? idOrObject?.id : idOrObject;

    if (!id) return null;

    try {
        const { data } = await soporteTecnicoApi.get<TypePrinting>(`/printingtypes/${id}`);
        return data;
    } catch (error) {
        // console.error(`${t("api_printing_type_by_id_error")} ${id}:`, error);
        void error;
        return null;
    }
};
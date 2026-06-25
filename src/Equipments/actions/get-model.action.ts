import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";
import { t } from "i18next";

// --- INTERFACES ---
export interface Model {
    id: string;
    name: string;
    id_brand: { id: string; name: string };
    created_at?: string;
    updated_at?: string;
}

export interface ModelsResponse {
    models: Model[]; 
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

export const getModelsAction = async (options: Options = {}): Promise<ModelsResponse> => {
    const { limit = 10, offset = 0, query = undefined } = options;

    try {
        const { data } = await soporteTecnicoApi.get<ModelsResponse>('/models', {
            params: {
                limit: isNaN(Number(limit)) ? 10 : Number(limit),
                offset: isNaN(Number(offset)) ? 0 : Number(offset),
                query: query?.replaceAll('+', ' '),
            },
        });

        return data;
    } catch (error) {
        // console.error(t("api_models_fetch_error"), error);
        void error;
        return {
            models: [],
            meta: { total: 0, page: 1, lastPage: 1 }
        };
    }
};

export const getModelsByBrandAction = async (
    brandIdOrObj: string | { id: string } | null | undefined,
    options: Options = {}
): Promise<ModelsResponse> => {
    const brandId = typeof brandIdOrObj === 'object' ? brandIdOrObj?.id : brandIdOrObj;
    const { limit = 50, offset = 0, query = undefined } = options;

    if (!brandId || typeof brandId !== 'string' || brandId === "[object Object]") {
        return { models: [], meta: { total: 0, page: 1, lastPage: 1 } };
    }

    try {
        const { data } = await soporteTecnicoApi.get<ModelsResponse>(`/models/brand/${brandId}`, {
            params: {
                limit: isNaN(Number(limit)) ? 50 : Number(limit),
                offset: isNaN(Number(offset)) ? 0 : Number(offset),
                query: query?.replaceAll('+', ' '),
            }
        });

        return data;
    } catch (error) {
        // console.error(`${t("api_models_by_brand_error")} ${brandId}:`, error);
        void error;
        return {
            models: [],
            meta: { total: 0, page: 1, lastPage: 1 }
        };
    }
};

export const getModelByIdAction = async (
    idOrObject: string | { id: string }
): Promise<Model | null> => {
    const id = typeof idOrObject === 'object' ? idOrObject?.id : idOrObject;

    if (!id) return null;

    try {
        const { data } = await soporteTecnicoApi.get<Model>(`/models/${id}`);
        return data;
    } catch (error) {
        // console.error(`${t("api_model_by_id_error")} ${id}:`, error);
        void error;
        return null;
    }
};

export const createModelAction = async (name: string, brandId: string): Promise<Model | null> => {
    try {
        const { data } = await soporteTecnicoApi.post<Model>('/models', {
            name,
            id_brand: brandId // Enviamos el UUID de la marca seleccionada
        });
        return data;
    } catch (error: unknown) {
        const message = (error as { response?: { data?: { message?: string } } }).response?.data?.message;
        console.error(Array.isArray(message) ? message.join(", ") : message || t("api_model_create_error"), error);
        return null;
    }
};
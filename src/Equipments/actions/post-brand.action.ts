import { soporteTecnicoApi } from "../../api/soporteTecnicoApi";
import type { Brand } from "./get-brand.action";
import { t } from "i18next";

export const createBrandAction = async (payload: string | { name: string }): Promise<Brand> => {
    try {
        // 1. Extraemos el valor del nombre de forma segura
        const nameValue = typeof payload === 'string' ? payload : payload.name;

        if (!nameValue) {
            throw new Error(t("api_brand_name_required"));
        }

        const cleanedName = nameValue.trim().replace(/\s+/g, ' ');
        const { data } = await soporteTecnicoApi.post<Brand>('/brands', {
            name: cleanedName
        });

        return data;
    } catch (error: unknown) {
        const errorMessage = (error as { response?: { data?: { message?: string } } }).response?.data?.message;

        throw new Error(
            Array.isArray(errorMessage)
                ? errorMessage.join(", ")
                : errorMessage || t("api_brand_create_error"),
            { cause: error }
        );
    }
};
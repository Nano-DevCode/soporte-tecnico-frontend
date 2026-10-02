import { soporteTecnicoApi } from "../../api/soporteTecnicoApi";
import { t } from "i18next";

// Definimos la interfaz para el DTO de NestJS
interface CreateModelDto {
    name: string;
    id_brand: string;
}

export const createModelAction = async (payload: string | { name: string }, id_brand: string) => {
    try {
        // 1. Extraemos el nombre (manejamos string o el objeto que envía el factory)
        const nameValue = typeof payload === 'string' ? payload : payload.name;

        if (!nameValue) throw new Error(t("api_model_name_required"));
        if (!id_brand) throw new Error(t("api_model_brand_required"));

        const cleanedName = nameValue.trim().replace(/\s+/g, ' ');

        // 2. Enviamos el objeto al backend de NestJS
        const { data } = await soporteTecnicoApi.post<CreateModelDto>('/models', { 
            name: cleanedName, 
            id_brand 
        });

        return data; 
    } catch (error: unknown) {
        const errorMessage = (error as { response?: { data?: { message?: string } } }).response?.data?.message || t("api_model_create_error");
        throw new Error(Array.isArray(errorMessage) ? errorMessage.join(", ") : errorMessage, { cause: error });
    }
};
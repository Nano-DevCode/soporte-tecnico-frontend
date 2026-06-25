import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";
import type { OperatingSystem } from "./get-operatingsystem.action";
import { t } from "i18next";

/**
 * Ajustamos el payload para manejar tanto el string directo como el objeto { name: string }.
 * Esto previene errores de ejecución al usar el factory de catálogos.
 */
export const createOperatingSystemAction = async (payload: string | { name: string }): Promise<OperatingSystem> => {
    try {
        // 1. Extraemos el nombre dinámicamente según el tipo de dato recibido
        const nameValue = typeof payload === 'string' ? payload : payload.name;

        if (!nameValue) {
            throw new Error(t("api_operating_system_name_required"));
        }

        const cleanedName = nameValue.trim();

        // 2. Enviamos la petición al endpoint de NestJS
        const { data } = await soporteTecnicoApi.post<OperatingSystem>('/operatingsystems', {
            name: cleanedName
        });

        return data;
    } catch (error: unknown) {
        const errorMessage = (error as { response?: { data?: { message?: string } } }).response?.data?.message;

        // Manejo de errores de validación del backend (ej. nombres duplicados)
        if (Array.isArray(errorMessage)) {
            throw new Error(errorMessage.join(", "), { cause: error });
        }

        throw new Error(errorMessage || t("api_operating_system_create_error"), { cause: error });
    }
};
import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";
import type { TypeNetwork } from "./get-networktype.action";
import { t } from "i18next";

/**
 * Ajustamos el payload para recibir string o el objeto { name: string }
 * que suele enviar el componente de creación rápida.
 */
export const createNetworkTypeAction = async (payload: string | { name: string }): Promise<TypeNetwork> => {
    try {
        // 1. Extraemos el nombre dinámicamente según el tipo de dato recibido
        const nameValue = typeof payload === 'string' ? payload : payload.name;

        if (!nameValue) {
            throw new Error(t("api_network_type_name_required"));
        }

        const cleanedName = nameValue.trim();

        // 2. Realizamos la petición POST al endpoint de redes
        const { data } = await soporteTecnicoApi.post<TypeNetwork>('/typenetworks', {
            name: cleanedName
        });

        return data;
    } catch (error: unknown) {
        const errorMessage = (error as { response?: { data?: { message?: string } } }).response?.data?.message;

        if (Array.isArray(errorMessage)) {
            throw new Error(errorMessage.join(", "), { cause: error });
        }

        // Proporcionamos un mensaje de error por defecto si el servidor no envía uno
        throw new Error(errorMessage || t("api_network_type_create_error"), { cause: error });
    }
};
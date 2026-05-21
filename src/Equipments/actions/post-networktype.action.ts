import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";
import type { typeNetwork } from "./get-networktype.action";

/**
 * Ajustamos el payload para recibir string o el objeto { name: string }
 * que suele enviar el componente de creación rápida.
 */
export const createNetworkTypeAction = async (payload: string | { name: string }): Promise<typeNetwork> => {
    try {
        // 1. Extraemos el nombre dinámicamente según el tipo de dato recibido
        const nameValue = typeof payload === 'string' ? payload : payload.name;

        if (!nameValue) {
            throw new Error("El nombre del tipo de red es requerido.");
        }

        const cleanedName = nameValue.trim();

        // 2. Realizamos la petición POST al endpoint de redes
        const { data } = await soporteTecnicoApi.post<typeNetwork>('/typenetworks', {
            name: cleanedName
        });

        return data;
    } catch (error: unknown) {
        const errorMessage = (error as { response?: { data?: { message?: string } } }).response?.data?.message;

        if (Array.isArray(errorMessage)) {
            throw new Error(errorMessage.join(", "));
        }

        // Proporcionamos un mensaje de error por defecto si el servidor no envía uno
        throw new Error(errorMessage || "Error al registrar el tipo de red.");
    }
};

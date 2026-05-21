import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";
import type { TypeStorage } from "./get-typestorage.action";

/**
 * Ajustamos el payload para manejar string o el objeto { name: string }.
 * Corregimos también el tipo de retorno en la petición POST.
 */
export const createTypeStorageAction = async (payload: string | { name: string }): Promise<TypeStorage> => {
    try {
        // 1. Extraemos el nombre dinámicamente según el tipo de dato recibido
        const nameValue = typeof payload === 'string' ? payload : payload.name;

        if (!nameValue) {
            throw new Error("El nombre del tipo de almacenamiento es requerido.");
        }

        const cleanedName = nameValue.trim();

        // 2. Petición al endpoint (Corregido el tipo de <Brand> a <TypeStorage>)
        const { data } = await soporteTecnicoApi.post<TypeStorage>('/storagetypes', {
            name: cleanedName
        });

        return data;
    } catch (error: unknown) {
        // Captura de excepciones del backend
        const errorMessage = (error as { response?: { data?: { message?: string } } }).response?.data?.message;

        if (Array.isArray(errorMessage)) {
            throw new Error(errorMessage.join(", "));
        }

        throw new Error(errorMessage || "Error al registrar el tipo de almacenamiento.");
    }
};

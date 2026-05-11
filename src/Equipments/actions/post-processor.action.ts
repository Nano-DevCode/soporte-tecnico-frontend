import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";

export interface Processor {
    id: string;
    brand: string;
    model: string;
    description: string;
}

/**
 * Ajustamos el payload para que sea polimórfico.
 * Puede recibir un string (creación rápida) o el objeto completo (desde un modal).
 */
export const createProcessorAction = async (payload: string | Omit<Processor, 'id'>): Promise<Processor> => {
    try {
        let cleanedData: Omit<Processor, 'id'>;

        if (typeof payload === 'string') {
            // Caso 1: Creación rápida desde el Select (ej. el usuario escribió "Core i7-13700K")
            // Como el DTO de NestJS exige brand y model, repartimos el valor.
            cleanedData = {
                brand: "Genérico", 
                model: payload.trim(),
                description: "Registro rápido desde inventario"
            };
        } else {
            // Caso 2: Objeto completo (desde un modal de creación detallada)
            cleanedData = {
                brand: payload.brand.trim(),
                model: payload.model.trim(),
                description: payload.description?.trim() || "Descripción no proporcionada",
            };
        }

        // Petición al backend de NestJS
        const { data } = await soporteTecnicoApi.post<Processor>('/computerprocessors', cleanedData);
        return data;
    } catch (error: unknown) {
        const errorMessage = (error as { response?: { data?: { message?: string } } }).response?.data?.message;

        if (Array.isArray(errorMessage)) {
            throw new Error(errorMessage.join(", "));
        }

        throw new Error(errorMessage || "No se pudo registrar el procesador.");
    }
};
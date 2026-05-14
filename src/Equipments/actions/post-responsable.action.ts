import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";

export interface Responsible {
    id: string;
    num_employe: string;
    name: string;
    first_name: string;
    last_name: string;
    area: string;
    mail: string;
}

/**
 * Ajustamos el payload para que sea flexible:
 * 1. Si es string: Creación rápida desde el select.
 * 2. Si es objeto: Creación completa desde un formulario/modal.
 */
export const createResponsibleAction = async (payload: string | Omit<Responsible, 'id'>): Promise<Responsible> => {
    try {
        let cleanedData: Omit<Responsible, 'id'>;

        if (typeof payload === 'string') {
            // CASO RÁPIDO: El usuario escribió un nombre en el buscador
            // Generamos datos temporales para cumplir con el DTO de NestJS
            const nameParts = payload.trim().split(" ");
            cleanedData = {
                name: nameParts[0] || "Nuevo",
                first_name: nameParts[1] || "Responsable",
                last_name: nameParts.slice(2).join(" ") || "S/A",
                num_employe: `TEMP-${Date.now()}`, // Número temporal
                area: "Por asignar",
                mail: `temp.${Date.now()}@soporte.com`, // Email temporal para evitar conflictos
            };
        } else {
            // CASO COMPLETO: Viene del Modal con todos los campos
            cleanedData = {
                num_employe: payload.num_employe.trim(),
                name: payload.name.trim(),
                first_name: payload.first_name.trim(),
                last_name: payload.last_name.trim(),
                area: payload.area.trim(),
                mail: payload.mail.trim().toLowerCase(),
            };
        }

        const { data } = await soporteTecnicoApi.post<Responsible>('/responsibleequipments', cleanedData);
        return data;
    } catch (error: unknown) {
        const errorMessage = (error as { response?: { data?: { message?: string } } }).response?.data?.message;

        if (Array.isArray(errorMessage)) {
            throw new Error(errorMessage.join(", "));
        }

        throw new Error(errorMessage || "No se pudo registrar el responsable.");
    }
};
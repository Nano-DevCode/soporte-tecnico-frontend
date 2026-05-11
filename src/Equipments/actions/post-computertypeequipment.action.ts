import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";
import type { ComputerTypeEquipment } from './get-computertypeequipment.action';

// Definimos una interfaz para el DTO que espera el Backend
interface CreateComputerTypeDto {
    name: string;
}

export const createComputerTypeEquipmentAction = async (payload: string | CreateComputerTypeDto): Promise<ComputerTypeEquipment> => {
    try {
        // 1. Extraemos el nombre sin importar si viene como string o como objeto { name: '...' }
        const nameValue = typeof payload === 'string' ? payload : payload.name;
        
        if (!nameValue) throw new Error("El nombre es requerido");

        const cleanedName = nameValue.trim();

        // 2. Enviamos el objeto exacto que espera NestJS
        const { data } = await soporteTecnicoApi.post<ComputerTypeEquipment>('/computerequipmenttypes', {
            name: cleanedName
        });

        return data;
    } catch (error: unknown) {
        const errorMessage = (error as { response?: { data?: { message?: string } } }).response?.data?.message;

        if (Array.isArray(errorMessage)) {
            throw new Error(errorMessage.join(", "));
        }

        throw new Error(errorMessage || "Error al registrar el tipo de equipo de computadora.");
    }
};
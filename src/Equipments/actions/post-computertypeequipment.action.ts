import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";
import type { ComputerTypeEquipment } from './get-computertypeequipment.action';
import { t } from "i18next";

// Definimos una interfaz para el DTO que espera el Backend
interface CreateComputerTypeDto {
    name: string;
}

export const createComputerTypeEquipmentAction = async (payload: string | CreateComputerTypeDto): Promise<ComputerTypeEquipment> => {
    try {
        // 1. Extraemos el nombre sin importar si viene como string o como objeto { name: '...' }
        const nameValue = typeof payload === 'string' ? payload : payload.name;
        
        if (!nameValue) throw new Error(t("api_computer_type_name_required"));

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

        throw new Error(errorMessage || t("api_computer_type_create_error"));
    }
};
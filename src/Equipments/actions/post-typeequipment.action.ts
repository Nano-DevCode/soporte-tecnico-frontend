import { t } from "i18next";
import { soporteTecnicoApi } from "../../api/soporteTecnicoApi";
import type { EquipmentType } from './get-equipmentType.action';

interface CreateComputerTypeDto {
    name: string;
}

export const createTypeEquipmentAction = async (payload: string | CreateComputerTypeDto): Promise<EquipmentType> => {
    try {
        const nameValue = typeof payload === 'string' ? payload : payload.name;
        
        if (!nameValue) throw new Error(t("api_equipment_type_name_required"));

        const cleanedName = nameValue.trim();

        const { data } = await soporteTecnicoApi.post<EquipmentType>('/equipmenttypes', {
            name: cleanedName
        });

        return data;
    } catch (error: unknown) {
        const errorMessage = (error as { response?: { data?: { message?: string } } }).response?.data?.message;

        if (Array.isArray(errorMessage)) {
            throw new Error(errorMessage.join(", "), { cause: error });
        }

        throw new Error(errorMessage || t("api_equipment_type_create_error"), { cause: error });
    }
};
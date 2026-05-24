import { t } from "i18next";
import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";
import type { TypeStorage } from "./get-typestorage.action";

export const createTypeStorageAction = async (payload: string | { name: string }): Promise<TypeStorage> => {
    try {
        const nameValue = typeof payload === 'string' ? payload : payload.name;

        if (!nameValue) {
            throw new Error(t("api_storage_type_name_required"));
        }

        const cleanedName = nameValue.trim();

        const { data } = await soporteTecnicoApi.post<TypeStorage>('/storagetypes', {
            name: cleanedName
        });

        return data;
    } catch (error: unknown) {
        const errorMessage = (error as { response?: { data?: { message?: string } } }).response?.data?.message;

        if (Array.isArray(errorMessage)) {
            throw new Error(errorMessage.join(", "));
        }

        throw new Error(errorMessage || t("api_storage_type_create_error"));
    }
};
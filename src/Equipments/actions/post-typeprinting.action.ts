import { t } from "i18next";
import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";
import type { TypePrinting } from "./get-typeprinting.action";

export const createTypePrintingAction = async (payload: string | { name: string }): Promise<TypePrinting> => {
    try {
        const nameValue = typeof payload === 'string' ? payload : payload.name;

        if (!nameValue) {
            throw new Error(t("api_printing_type_name_required"));
        }

        const cleanedName = nameValue.trim();

        const { data } = await soporteTecnicoApi.post<TypePrinting>('/printingtypes', {
            name: cleanedName
        });

        return data;
    } catch (error: unknown) {
        const errorMessage = (error as { response?: { data?: { message?: string } } }).response?.data?.message;

        if (Array.isArray(errorMessage)) {
            throw new Error(errorMessage.join(", "), { cause: error });
        }

        throw new Error(errorMessage || t("api_printing_type_create_error"), { cause: error });
    }
};
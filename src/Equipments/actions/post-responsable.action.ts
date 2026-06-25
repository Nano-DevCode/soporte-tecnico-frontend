import { t } from "i18next";
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

export const createResponsibleAction = async (payload: string | Omit<Responsible, 'id'>): Promise<Responsible> => {
    try {
        let cleanedData: Omit<Responsible, 'id'>;

        if (typeof payload === 'string') {
            // CASO RÁPIDO: El usuario escribió un nombre en el buscador
            const nameParts = payload.trim().split(" ");
            cleanedData = {
                name: nameParts[0] || t("api_responsible_quick_name"),
                first_name: nameParts[1] || t("api_responsible_quick_firstname"),
                last_name: nameParts.slice(2).join(" ") || t("api_responsible_quick_lastname"),
                num_employe: `TEMP-${Date.now()}`,
                area: t("api_responsible_quick_area"),
                mail: `temp.${Date.now()}@soporte.com`,
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
            throw new Error(errorMessage.join(", "), { cause: error });
        }

        throw new Error(errorMessage || t("api_responsible_create_error"), { cause: error });
    }
};
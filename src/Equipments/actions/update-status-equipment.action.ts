// import { t } from "i18next";
import { soporteTecnicoApi } from "../../api/soporteTecnicoApi";

interface StatusResponse {
    id: string;
    status: boolean;
    message: string;
}

export const activateEquipmentAction = async (id: string): Promise<StatusResponse> => {
    try {
        const { data } = await soporteTecnicoApi.patch<StatusResponse>(`/equipments/${id}/activate`);
        return data;
    } catch (error) {
        // console.error(t("api_equipment_activate_error"), error);
        void error;
        throw error;
    }
};

export const deactivateEquipmentAction = async (id: string): Promise<StatusResponse> => {
    try {
        const { data } = await soporteTecnicoApi.patch<StatusResponse>(`/equipments/${id}/deactivate`);
        return data;
    } catch (error) {
        // console.error(t("api_equipment_deactivate_error"), error);
        void error;
        throw error;
    }
};
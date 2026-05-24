import { isAxiosError } from "axios";
import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";
import { t } from "i18next";

export interface EquipmentPayload {
    id?: string;
    num_inventario?: string;
    id_model?: string;
    id_brand?: string;

    id_type_equipment?: string | number;
    id_departament?: string;
    id_responsable?: string;
    description?: string;
    status?: boolean;
    computer?: Record<string, unknown>;
    printer?: Record<string, unknown>;
    network?: Record<string, unknown>;
}

const cleanEquipmentPayload = (payload: EquipmentPayload): EquipmentPayload => {
    // Protección contra payloads vacíos o corruptos
    if (!payload || !payload.id_type_equipment) {
        return payload;
    }

    const typeId = String(payload.id_type_equipment);
    const cleaned = { ...payload };

    delete cleaned.id;
    delete cleaned.id_brand;

    // Validación segura: si es un objeto extrae el ID, si no conserva lo que tenga de forma segura
    if (cleaned.id_model && typeof cleaned.id_model === 'object' && 'id' in cleaned.id_model) {
        cleaned.id_model = (cleaned.id_model as { id: string }).id;
    }

    if (typeId === "1") {
        delete cleaned.printer;
        delete cleaned.network;
    } else if (typeId === "3") {
        delete cleaned.computer;
        delete cleaned.network;
    } else if (typeId === "2") {
        delete cleaned.computer;
        delete cleaned.printer;
    } else {
        delete cleaned.computer;
        delete cleaned.printer;
        delete cleaned.network;
    }
    
    if (cleaned.status === undefined) cleaned.status = true;
    return cleaned;
};


export const createEquipmentAction = async (payload: EquipmentPayload) => {
    try {
        const dataToSend = cleanEquipmentPayload(payload);
        const { data } = await soporteTecnicoApi.post("/equipments", dataToSend);
        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            console.error(t("api_equipments_server_create_error"), error.response?.data);
            
            // IMPORTANTE: Lanza el error completo, NO solo el .data
            // Esto permite que Sileo y el utilitario handleBackendFormErrors identifiquen que es un error de Axios
            throw error.response?.data; 
        }
        throw error;
    }
};

export const updateEquipmentAction = async (id: string, payload: Partial<EquipmentPayload>) => {
    try {
        const dataToProcess = { ...payload };
        delete dataToProcess.id;

        const dataToSend = cleanEquipmentPayload(dataToProcess);
        const { data } = await soporteTecnicoApi.patch(`/equipments/${id}`, dataToSend);
        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            console.error(t("api_equipments_server_update_error"), error.response?.data);
            throw error.response?.data;
        }
        throw error;
    }
};
import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";

// Interfaz para la respuesta del servidor (basada en tu EquipmentsService.changeStatus)
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
        console.error("Error al activar el equipo:", error);
        throw error;
    }
};

export const deactivateEquipmentAction = async (id: string): Promise<StatusResponse> => {
    try {
        const { data } = await soporteTecnicoApi.patch<StatusResponse>(`/equipments/${id}/deactivate`);
        return data;
    } catch (error) {
        console.error("Error al desactivar el equipo:", error);
        throw error;
    }
};

import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";

export interface EquipmentType {
    id: string;
    name: string;
}

export const getEquipmentTypesAction  = async (): Promise<EquipmentType[]> => {
    try {
        const { data } = await soporteTecnicoApi.get<EquipmentType[]>('/equipmenttypes');
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error("Error al obtener tipos de equipos:", error);
        return []; // Retorno seguro para evitar que .map() falle en la UI
    }
};

export const getEquipmentTypeByIdAction = async (id: string): Promise<EquipmentType > => {
    try {
        const { data } = await soporteTecnicoApi.get<EquipmentType>(`/equipmenttypes/${id}`);
        return data;
    } catch (error: unknown) {
        const message = (error as { response?: { data?: { message?: string } } }).response?.data?.message || "No se encontró el tipo de equipo";
        throw new Error(message);
    }
};
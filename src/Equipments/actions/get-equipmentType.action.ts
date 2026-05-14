
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

export const getEquipmentTypeByIdAction= async (idOrObject: string | { id: string }) => {
    // Si es un objeto, extraemos el id; si no, usamos el valor directamente
    const id = typeof idOrObject === 'object' ? idOrObject.id : idOrObject;

    if (!id) return null;

    const { data } = await soporteTecnicoApi.get<EquipmentType>(`/equipmenttypes/${id}`);
    return data;
};
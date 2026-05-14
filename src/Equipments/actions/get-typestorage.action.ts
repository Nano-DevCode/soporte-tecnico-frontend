import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";

export interface TypeStorage {
    id: string;
    name: string;
}

export const getTypeStoragesAction = async (): Promise<TypeStorage[]> => {
    try {
        const { data } = await soporteTecnicoApi.get<TypeStorage[]>('/storagetypes');
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error("Error al obtener tipos de almacenamiento:", error);
        return []; // Retorno seguro para evitar que .map() falle en la UI
    }
};

export const getTypeStorageByIdAction  = async (idOrObject: string | { id: string }) => {
    // Si es un objeto, extraemos el id; si no, usamos el valor directamente
    const id = typeof idOrObject === 'object' ? idOrObject.id : idOrObject;

    if (!id) return null;

    const { data } = await soporteTecnicoApi.get<TypeStorage>(`/storagetypes/${id}`);
    return data;
};
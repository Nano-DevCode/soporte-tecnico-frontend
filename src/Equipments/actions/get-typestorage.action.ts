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

export const getTypeStorageByIdAction = async (id: string): Promise<TypeStorage> => {
    try {
        const { data } = await soporteTecnicoApi.get<TypeStorage>(`/storagetypes/${id}`);
        return data;
    } catch (error: any) {
        const message = error.response?.data?.message || "No se encontró el tipo de almacenamiento";
        throw new Error(message);
    }
};
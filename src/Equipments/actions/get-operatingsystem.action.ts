import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";

export interface OperatingSystem {
    id: string;
    name: string;
}

export const getOperatingSystemsAction = async (): Promise<OperatingSystem[]> => {
    try {
        const { data } = await soporteTecnicoApi.get<OperatingSystem[]>('/operatingsystems');
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error("Error al obtener sistemas operativos:", error);
        return []; // Retorno seguro para evitar que .map() falle en la UI
    }
};

export const getOperatingSystemByIdAction = async (id: string): Promise<OperatingSystem > => {
    try {
        const { data } = await soporteTecnicoApi.get<OperatingSystem>(`/operatingsystems/${id}`);
        return data;
    } catch (error: any) {
        const message = error.response?.data?.message || "No se encontró el sistema operativo";
        throw new Error(message);
    }
};
import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";

export interface typeNetwork {
    id: string;
    name: string;
}

export const getNetworkTypesAction = async (): Promise<typeNetwork[]> => {
    try {
        const { data } = await soporteTecnicoApi.get<typeNetwork[]>('/typenetworks');
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error("Error al obtener tipos de red:", error);
        return []; // Retorno seguro para evitar que .map() falle en la UI
    }
};

export const getNetworkTypeByIdAction = async (id: string): Promise<typeNetwork> => {
    try {
        const { data } = await soporteTecnicoApi.get<typeNetwork>(`/typenetworks/${id}`);
        return data;
    } catch (error: any) {
        const message = error.response?.data?.message || "No se encontró el tipo de red";
        throw new Error(message);
    }
};
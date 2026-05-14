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

export const getOperatingSystemByIdAction = async (idOrObject: string | { id: string }) => {
    // Si es un objeto, extraemos el id; si no, usamos el valor directamente
    const id = typeof idOrObject === 'object' ? idOrObject.id : idOrObject;

    if (!id) return null;

    const { data } = await soporteTecnicoApi.get<OperatingSystem>(`/operatingsystems/${id}`);
    return data;
};
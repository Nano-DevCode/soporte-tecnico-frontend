import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";

export interface TypePrinting {
    id: string;
    name: string;
}

export const getTypePrintingsAction = async (): Promise<TypePrinting[]> => {
    try {
        const { data } = await soporteTecnicoApi.get<TypePrinting[]>('/printingtypes');
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error("Error al obtener tipos de impresión:", error);
        return []; // Retorno seguro para evitar que .map() falle en la UI
    }
};

export const getTypePrintingByIdAction  = async (idOrObject: string | { id: string }) => {
    // Si es un objeto, extraemos el id; si no, usamos el valor directamente
    const id = typeof idOrObject === 'object' ? idOrObject.id : idOrObject;

    if (!id) return null;

    const { data } = await soporteTecnicoApi.get<TypePrinting>(`/printingtypes/${id}`);
    return data;
};
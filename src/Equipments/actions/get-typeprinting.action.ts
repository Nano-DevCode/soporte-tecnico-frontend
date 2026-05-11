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

export const getTypePrintingByIdAction = async (id: string): Promise<TypePrinting > => {
    try {
        const { data } = await soporteTecnicoApi.get<TypePrinting>(`/printingtypes/${id}`);
        return data;
    } catch (error: any) {
        const message = error.response?.data?.message || "No se encontró el tipo de impresión";
        throw new Error(message);
    }
};
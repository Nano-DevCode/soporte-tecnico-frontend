import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";

export interface PrinterTypeFunction {
    id: string;
    name: string;
}

export const getPrinterTypeFunctionAction = async (): Promise<PrinterTypeFunction[]> => {
    try {
        const { data } = await soporteTecnicoApi.get<PrinterTypeFunction[]>('/printerfunctiontypes');
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error("Error al obtener tipos de función de impresora:", error);
        return []; // Retorno seguro para evitar que .map() falle en la UI
    }
};

export const getPrintertypeFunctionByIdAction = async (idOrObject: string | { id: string }) => {
    // Si es un objeto, extraemos el id; si no, usamos el valor directamente
    const id = typeof idOrObject === 'object' ? idOrObject.id : idOrObject;

    if (!id) return null;

    const { data } = await soporteTecnicoApi.get<PrinterTypeFunction>(`/printerfunctiontypes/${id}`);
    return data;
};
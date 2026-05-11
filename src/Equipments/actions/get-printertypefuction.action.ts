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

export const getPrintertypeFunctionByIdAction = async (id: string): Promise<PrinterTypeFunction> => {
    try {
        const { data } = await soporteTecnicoApi.get<PrinterTypeFunction>(`/printerfunctiontypes/${id}`);
        return data;
    } catch (error: any) {
        const message = error.response?.data?.message || "No se encontró el tipo de función de impresora";
        throw new Error(message);
    }
};
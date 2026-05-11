import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";
import type { Processor } from "./post-processor.action";

export const getProcessorsAction = async (): Promise<Processor[]> => {
    try {
        const { data } = await soporteTecnicoApi.get<Processor[]>('/computerprocessors');
        return data; // Retorna la lista ordenada por marca y modelo
    } catch (error) {
        console.error("Error al obtener procesadores:", error);
        return [];
    }
};
    
export const getProcessorByIdAction = async (id: string): Promise<Processor > => {
    try {
        const { data } = await soporteTecnicoApi.get<Processor>(`/computerprocessors/${id}`);
        return data;
    } catch (error: unknown) {
        const message = (error as { response?: { data?: { message?: string } } }).response?.data?.message || "No se encontró el procesador";
        throw new Error(message);
    }
};
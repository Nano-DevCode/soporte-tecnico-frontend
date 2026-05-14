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
    
export const getProcessorByIdAction = async (idOrObject: string | { id: string }) => {
    const id = typeof idOrObject === 'object' ? idOrObject.id : idOrObject;
    if (!id) return null;

    const { data } = await soporteTecnicoApi.get<Processor>(`/computerprocessors/${id}`);
    
    // Devolvemos el objeto procesado para que el selector lo entienda directo
    return {
        ...data,
        id: data.id,
        // Combinamos Brand + Model + Description para el display
        name: `${data.brand || ''} ${data.model || ''} ${data.description || ''}`.trim()
    };
};

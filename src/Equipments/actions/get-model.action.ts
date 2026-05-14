import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";

export interface Model {
    id: string;
    name: string;
    id_brand: { id: string; name: string };
}

// 1. Obtener modelos filtrados por marca
export const getModelsByBrandAction = async (brandId: string): Promise<Model[]> => {
    try {
        // Si no añadiste el endpoint en el controller, usa el findAll() y filtra en el front
        // Pero lo ideal es usar: GET /models/brand/:id
        const { data } = await soporteTecnicoApi.get<Model[]>(`/models/brand/${brandId}`);
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error("Error al obtener modelos por marca:", error);
    return [];
}
};

// 2. Crear un modelo (Requiere id_brand obligatoriamente según tu ModelsService)
// get-model.action.ts

// ... (getModelsByBrandAction se queda igual)

export const createModelAction = async (name: string, brandId: string): Promise<Model> => {
    try {
        const { data } = await soporteTecnicoApi.post<Model>('/models', {
            name,
            id_brand: brandId // Enviamos el UUID de la marca seleccionada
        });
        return data;
    } catch (error: unknown) {
        const message = (error as { response?: { data?: { message?: string } } }).response?.data?.message;
        throw new Error(Array.isArray(message) ? message.join(", ") : message || "Error al crear modelo");
    }
};
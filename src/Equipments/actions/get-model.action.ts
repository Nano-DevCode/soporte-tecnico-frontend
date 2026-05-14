import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";

export interface Model {
    id: string;
    name: string;
    id_brand: { id: string; name: string };
}

// 1. Obtener modelos filtrados por marca
// export const getModelByIdAction = async (idOrObject: string | { id: string }) => {
//     // Si es un objeto, extraemos el id; si no, usamos el valor directamente
//     const id = typeof idOrObject === 'object' ? idOrObject.id : idOrObject;

//     if (!id) return null;

//     const { data } = await soporteTecnicoApi.get<Model>(`/models/${id}`);
//     return data;
// };
// actions/get-model.action.ts
export const getModelByIdAction = async (id: string): Promise<Model> => {
    const { data } = await soporteTecnicoApi.get<Model>(`/models/${id}`);
    return data; // Esto debe traer { id, name, id_brand: { id, name } }
};


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

export const getModelsByBrandAction = async (brandIdOrObj: string | { id: string; } | null | undefined) => {
    // Extraemos el ID del objeto de la marca
    const brandId = typeof brandIdOrObj === 'object' ? brandIdOrObj?.id : brandIdOrObj;

    // Si no hay ID (ej. marca no seleccionada), devolvemos array vacío en vez de tirar error
    if (!brandId || typeof brandId !== 'string' || brandId === "[object Object]") {
        return [];
    }

    try {
        const { data } = await soporteTecnicoApi.get(`/models/brand/${brandId}`);
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error("Error al obtener modelos por marca:", error);
        return [];
    }
};
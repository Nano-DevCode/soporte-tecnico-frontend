import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";

export interface Brand {
    id: string;
    name: string;
    // Añade otros campos si tu entidad Brand los tiene
}

/**
 * Obtiene todas las marcas ordenadas alfabéticamente (según el backend).
 */
export const getBrandsAction = async (): Promise<Brand[]> => {
    try {
        const { data } = await soporteTecnicoApi.get<Brand[]>('/brands');

        // Validamos que sea un array
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error("Error al obtener marcas:", error);
        return []; // Retorno seguro para evitar que .map() falle en la UI
    }
};

/**
 * Obtiene una marca específica por su ID (UUID).
 */
export const getBrandByIdAction = async (idOrObject: string | { id: string }) => {
    // Si es un objeto, extraemos el id; si no, usamos el valor directamente
    const id = typeof idOrObject === 'object' ? idOrObject.id : idOrObject;

    if (!id) return null;

    const { data } = await soporteTecnicoApi.get<Brand>(`/brands/${id}`);
    return data;
};
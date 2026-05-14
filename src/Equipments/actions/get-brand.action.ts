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
export const getBrandByIdAction = async (id: string): Promise<Brand> => {
    try {
        const { data } = await soporteTecnicoApi.get<Brand>(`/brands/${id}`);
        return data;
    } catch (error: unknown) {
        const message = (error as { response?: { data?: { message?: string } } }).response?.data?.message || "No se encontró la marca";
        throw new Error(message);
    }
};
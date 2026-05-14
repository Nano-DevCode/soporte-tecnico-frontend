import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";

export interface Responsible {
    id?: string;
    num_employe: string;
    name: string;
    first_name: string;
    last_name: string;
    area: string;
    mail: string;
}

/**
 * Obtiene la lista de responsables. 
 * Se incluye blindaje para asegurar que siempre devuelva un array.
 */
export const getResponsiblesAction = async (): Promise<Responsible[]> => {
    try {
        const { data } = await soporteTecnicoApi.get<Responsible[]>('/responsibleequipments');

        // BLINDAJE: Verificamos que 'data' sea realmente un arreglo.
        // Si el backend devuelve un objeto con metadata o error, esto evita que la UI rompa.
        if (Array.isArray(data)) return data;

        // Si la respuesta tiene una propiedad 'data' anidada (común en algunas configs de axios)
        if (data && typeof data === 'object' && Array.isArray((data as any).data)) {
            return (data as any).data;
        }

        return [];
    } catch (error: any) {
        console.error("Error en getResponsiblesAction:", error.message);

        // IMPORTANTE: Siempre retornar un array vacío en el catch.
        // Esto garantiza que el componente que hace el .map() no lance un TypeError.
        return [];
    }
};
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
        if (data && typeof data === 'object' && 'data' in data && Array.isArray((data as { data: Responsible[] }).data)) {
            return (data as { data: Responsible[] }).data;
        }

        return [];
    } catch (error: unknown) {
        console.error("Error en getResponsiblesAction:", error instanceof Error ? error.message : error);

        // IMPORTANTE: Siempre retornar un array vacío en el catch.
        // Esto garantiza que el componente que hace el .map() no lance un TypeError.
        return [];
    }
};


export const getResponsibleByIdAction = async (idOrObject: string | { id: string }) => {
    const id = typeof idOrObject === 'object' ? idOrObject.id : idOrObject;
    if (!id) return null;

    const { data } = await soporteTecnicoApi.get<Responsible>(`/responsibleequipments/${id}`);
    
    // IMPORTANTE: Devolvemos un objeto que tenga 'id' y 'name'
    return {
        id: data.id,
        // Construimos el nombre completo aquí
        name: `${data.name || ''} ${data.first_name || ''} ${data.last_name || ''}`.trim()
    };
};
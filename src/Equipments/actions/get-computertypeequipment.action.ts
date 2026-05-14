import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";

export interface ComputerTypeEquipment {
    id: string;
    name: string;
    // Añade otros campos si tu entidad Brand los tiene
}

/**
 * Obtiene todas las marcas ordenadas alfabéticamente (según el backend).
 */
export const getComputerTypeEquipmentsAction = async (): Promise<ComputerTypeEquipment[]> => {
    try {
        const { data } = await soporteTecnicoApi.get<ComputerTypeEquipment[]>('/computerequipmenttypes');

        // Validamos que sea un array
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error("Error al obtener tipos de equipos de computadoras:", error);
        return []; // Retorno seguro para evitar que .map() falle en la UI
    }
};

/**
 * Obtiene un tipo de equipo de computadora específico por su ID (UUID).
 */
export const getComputerTypeEquipmentByIdAction = async (idOrObject: string | { id: string }) => {
    // Si es un objeto, extraemos el id; si no, usamos el valor directamente
    const id = typeof idOrObject === 'object' ? idOrObject.id : idOrObject;

    if (!id) return null;

    const { data } = await soporteTecnicoApi.get<ComputerTypeEquipment>(`/computerequipmenttypes/${id}`);
    return data;
};
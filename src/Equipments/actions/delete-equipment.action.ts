import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";

/**
 * Elimina un equipo de la base de datos de forma permanente.
 * @param id - El UUID o ID único del equipo a eliminar.
 * @returns El mensaje de confirmación del backend.
 */
export const deleteEquipmentAction = async (id: string): Promise<void> => {
    try {
        const { data } = await soporteTecnicoApi.delete(`/equipments/${id}`);
        return data;
    } catch (error: any) {
        // Manejo de errores específico (ej. si el equipo tiene dependencias en tickets)
        if (error.response?.status === 400) {
            throw new Error("No se puede eliminar el equipo porque tiene registros asociados.");
        }
        throw new Error("Error al intentar eliminar el equipo.");
    }
};
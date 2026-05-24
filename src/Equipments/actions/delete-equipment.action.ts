import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";
import { isAxiosError } from "axios";

export const deleteEquipmentAction = async (id: string): Promise<void> => {
    try {
        const { data } = await soporteTecnicoApi.delete(`/equipments/${id}`);
        return data;
    } catch (error: unknown) {
        if (isAxiosError(error) && error.response?.status === 400) {
            throw new Error("No se puede eliminar el equipo porque tiene registros asociados.");
        }
        throw new Error("Error al intentar eliminar el equipo.");
    }
};
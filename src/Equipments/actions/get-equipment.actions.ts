
import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";
// import type { Equipment } from "../interfaces/equipment.interface";

/**
 * Obtiene la información detallada de un equipo específico por su ID.
 * @param id - El UUID del equipo.
 * @returns Una promesa con los datos del equipo.
 */
export const getEquipmentByIdAction = async (id: string) => {
  try {
    // Asegúrate de que la URL se construye correctamente con el ID recibido
    const { data } = await soporteTecnicoApi.get(`/equipments/${id}`);
    return data;
  } catch (error) {
    console.error("Error fetching equipment:", error);
    throw error;
  }
};

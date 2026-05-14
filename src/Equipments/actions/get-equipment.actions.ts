
import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";
// import type { Equipment } from "../interfaces/equipment.interface";

/**
 * Obtiene la información detallada de un equipo específico por su ID.
 * @param id - El UUID del equipo.
 * @returns Una promesa con los datos del equipo.
 */
/**
 * Obtiene la información detallada de un equipo específico por su ID.
 */
export const getEquipmentByIdAction = async (idOrObject: string | { id: string }) => {
  try {
    const id = typeof idOrObject === 'object' ? idOrObject.id : idOrObject;

    if (!id || id === 'undefined') return null;

    const { data } = await soporteTecnicoApi.get(`/equipments/${id}`);
    return data;
  } catch (error) {
    console.error("Error fetching equipment:", error);
    // Lanzamos el error para que useQuery sepa que falló
    throw new Error("No se pudo cargar la información del equipo");
  }
};

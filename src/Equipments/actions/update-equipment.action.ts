import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";
import type { Equipment } from "../interfaces/equipment.interface";

// Usamos Partial para que todos los campos sean opcionales al actualizar
export interface UpdateEquipmentDTO {
  // DATOS DEL EQUIPO PADRE
  num_inventario?: string;
  id_model?: string;
  id_type_equipment?: string;
  id_responsable?: string;
  status?: boolean;

  // DATOS HIJO: COMPUTADORA
  id_type_equipment_computer?: string;
  id_type_storage?: string;
  id_type_operating_system?: string;
  id_processor?: string;
  ram?: string;
  capacity_storage?: string;
  available_storage?: string;

  // DATOS HIJO: IMPRESORA
  id_type_printing?: string;
  id_type_function?: string;
  color?: string;
  model_toner?: string;

  // DATOS HIJO: RED
  id_type_equipment_network?: string;
  number_ports?: number;
  PoE?: boolean;
}

/**
 * Actualiza un equipo existente mediante su ID.
 * @param id - UUID del equipo a modificar.
 * @param equipment - Campos a actualizar.
 */
export const equipmentUpdateAction = async (
  id: string, 
  equipment: UpdateEquipmentDTO
): Promise<Equipment> => {
  try {
    const { data } = await soporteTecnicoApi.patch<Equipment>(`/equipments/${id}`, equipment);
    return data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message;
    
    // Si NestJS devuelve un array de errores de validación, los unimos
    if (Array.isArray(errorMessage)) {
      throw new Error(errorMessage.join(", "));
    }
    
    throw new Error(errorMessage || "Error al intentar actualizar el equipo.");
  }
};
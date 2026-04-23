// import { soporteTecnicoApi } from "@/api/soporteTecnicoApi"; // Ajusta el import a tu instancia de Axios
// import type { Department } from "../interfaces/equipment.interface";

// export interface CreateDepartmentDTO {
//   name: string;
//   acronym: string;
//   priority: number;
// }

// export const createDepartmentAction = async (department: CreateDepartmentDTO): Promise<Department> => {
//   const { data } = await soporteTecnicoApi.post<Department>('/departments', department);
//   return data;
// };
import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";
import type { Equipment } from "../interfaces/equipment.interface";

export interface CreateEquipmentDTO {
  // ==========================================
  // DATOS DEL EQUIPO PADRE (EQUIPMENT)
  // ==========================================
  num_inventario: string;
  id_model: string;
  id_type_equipment: string;
  id_responsable?: string;

  // ==========================================
  // DATOS HIJO: COMPUTADORA (Opcionales)
  // ==========================================
  id_type_equipment_computer?: string;
  id_type_storage?: string;
  id_type_operating_system?: string;
  id_processor?: string;
  ram?: string;
  capacity_storage?: string;
  available_storage?: string;

  // ==========================================
  // DATOS HIJO: IMPRESORA (Opcionales)
  // ==========================================
  id_type_printing?: string;
  id_type_function?: string;
  color?: string;
  model_toner?: string;

  // ==========================================
  // DATOS HIJO: RED (Opcionales)
  // ==========================================
  id_type_equipment_network?: string;
  number_ports?: number;
  PoE?: boolean;
}

/**
 * Crea un nuevo registro de equipo en el sistema.
 */
export const createEquipmentAction = async (equipment: CreateEquipmentDTO): Promise<Equipment> => {
  try {
    const { data } = await soporteTecnicoApi.post<Equipment>('/equipments', equipment);
    return data;
  } catch (error: any) {
    // Captura el mensaje específico de NestJS (class-validator)
    const errorMessage = error.response?.data?.message;
    
    if (Array.isArray(errorMessage)) {
      throw new Error(errorMessage.join(", "));
    }
    
    throw new Error(errorMessage || "No se pudo registrar el equipo.");
  }
};
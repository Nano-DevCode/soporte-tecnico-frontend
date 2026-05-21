
import type { Equipment } from "../interfaces/equipment.interface";
import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";
import type { EquipmentPayload } from "./post-equipment.action";
import { isAxiosError } from "axios";

export const equipmentUpdateAction = async (id: string, dto: Partial<EquipmentPayload> & Record<string, unknown>): Promise<Equipment> => {
  try {
    const cleanPayload = { ...dto } as Record<string, unknown>;

    const idFields = ['id_brand', 'id_model', 'id_responsable', 'id_departament', 'id_type_equipment'];
    idFields.forEach(field => {
      if (cleanPayload[field] && typeof cleanPayload[field] === 'object' && 'id' in (cleanPayload[field] as object)) {
        cleanPayload[field] = (cleanPayload[field] as { id: string }).id;
      }
    });
  const typeName = (dto.id_type_equipment_obj as { name?: string })?.name?.toLowerCase() || "";

    if (typeName.includes("computadora")) {
      delete cleanPayload.printer;
      delete cleanPayload.network;
      if (cleanPayload.computer && typeof cleanPayload.computer === 'object') {
        const computer = cleanPayload.computer as Record<string, unknown>;
        computer.ram = Number(computer.ram);
      }
    } else if (typeName.includes("impresora")) {
      delete cleanPayload.computer;
      delete cleanPayload.network;
    } else if (typeName.includes("red")) {
      delete cleanPayload.computer;
      delete cleanPayload.printer;
      if (cleanPayload.network && typeof cleanPayload.network === 'object') {
        const network = cleanPayload.network as Record<string, unknown>;
        network.number_ports = Number(network.number_ports);
      }
    }
    delete cleanPayload.id_type_equipment_obj;

    const { data } = await soporteTecnicoApi.patch<Equipment>(`/equipments/${id}`, cleanPayload);
    return data;

  } catch (error: unknown) {
    console.error("Update Action Error:", error);
    const errorMessage = isAxiosError(error) ? error.response?.data?.message : null;
    throw new Error(
      Array.isArray(errorMessage) 
        ? errorMessage.join(" | ") 
        : errorMessage || "Error al actualizar el equipo"
    );
  }
};


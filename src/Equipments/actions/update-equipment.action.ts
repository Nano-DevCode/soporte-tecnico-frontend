/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Equipment } from "../interfaces/equipment.interface";
import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";

export const equipmentUpdateAction = async (id: string, dto: any): Promise<Equipment> => {
  try {
    const cleanPayload = { ...dto };

    const idFields = ['id_brand', 'id_model', 'id_responsable', 'id_departament', 'id_type_equipment'];
    idFields.forEach(field => {
      if (cleanPayload[field] && typeof cleanPayload[field] === 'object') {
        cleanPayload[field] = cleanPayload[field].id;
      }
    });
    const typeName = dto.id_type_equipment_obj?.name?.toLowerCase() || "";

    if (typeName.includes("computadora")) {
      delete cleanPayload.printer;
      delete cleanPayload.network;
      if (cleanPayload.computer) {
        cleanPayload.computer.ram = Number(cleanPayload.computer.ram);
      }
    } else if (typeName.includes("impresora")) {
      delete cleanPayload.computer;
      delete cleanPayload.network;
    } else if (typeName.includes("red")) {
      delete cleanPayload.computer;
      delete cleanPayload.printer;
      if (cleanPayload.network) {
        cleanPayload.network.number_ports = Number(cleanPayload.network.number_ports);
      }
    }
    delete cleanPayload.id_type_equipment_obj;

    const { data } = await soporteTecnicoApi.patch<Equipment>(`/equipments/${id}`, cleanPayload);
    return data;

  } catch (error: any) {
    console.error("Update Action Error:", error);
    const errorMessage = error.response?.data?.message;
    throw new Error(
      Array.isArray(errorMessage) 
        ? errorMessage.join(" | ") 
        : errorMessage || "Error al actualizar el equipo"
    );
  }
};
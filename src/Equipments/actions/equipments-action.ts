// actions/equipment-actions.ts
import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";
import type { Equipment } from "../interfaces/equipment.interface";

export const createEquipmentAction = async (data: Partial<Equipment>) => {
    const { data: response } = await soporteTecnicoApi.post<Equipment>('/equipments', data);
    return response;
};

export const updateEquipmentAction = async (id: string, data: Partial<Equipment>) => {
    const { data: response } = await soporteTecnicoApi.patch<Equipment>(`/equipments/${id}`, data);
    return response;
};
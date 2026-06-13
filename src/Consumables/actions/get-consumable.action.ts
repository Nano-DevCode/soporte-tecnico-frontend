import type { Consumable } from "../interfaces/consumable.interfaces";
import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";

export const getConsumableByIdAction = async (id: string): Promise<Consumable> => {
  const { data } = await soporteTecnicoApi.get<Consumable>(`/consumables/${id}`);
  return data;
};
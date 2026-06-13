import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";
import type { Consumable } from "../interfaces/consumable.interfaces";

const prepareFormData = (payload: FormData): FormData => {
  if (payload.has("file")) {
    const file = payload.get("file");
    if (file instanceof File) {
      payload.append("image", file);
      payload.delete("file"); // Limpiamos el nombre viejo del frontend
    }
  }
  return payload;
};

export const createConsumableAction = async (payload: FormData): Promise<Consumable> => {
  const body = prepareFormData(payload);
  
  const { data } = await soporteTecnicoApi.post<Consumable>("/consumables", body, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};

export const updateConsumableAction = async (id: string, payload: FormData): Promise<Consumable> => {
  const body = prepareFormData(payload);

  const { data } = await soporteTecnicoApi.patch<Consumable>(`/consumables/${id}`, body, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};
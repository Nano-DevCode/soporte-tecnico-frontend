import type { Consumable } from "../interfaces/consumable.interfaces";
import { soporteTecnicoApi, getBaseUrl } from "../../api/soporteTecnicoApi";

export const getConsumableByIdAction = async (id: string): Promise<Consumable> => {
  const { data } = await soporteTecnicoApi.get<Consumable>(`/consumables/${id}`);

  if (data?.imageUrl && !data.imageUrl.startsWith("http://") && !data.imageUrl.startsWith("https://")) {
    const baseUrl = getBaseUrl();
    const cleanPath = data.imageUrl.startsWith("/") ? data.imageUrl : `/${data.imageUrl}`;
    data.imageUrl = `${baseUrl}${cleanPath}`;
  }

  return data;
};
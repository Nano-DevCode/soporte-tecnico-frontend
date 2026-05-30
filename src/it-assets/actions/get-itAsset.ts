import { soporteTecnicoApi } from "@/api/soporteTecnicoApi"
import type { ItAsset } from "../interfaces/itAssetsResponse.interface"; // Verifica que esta ruta exista

interface Options {
  id: string;
}

export const getItAssetAction = async(options: Options): Promise<ItAsset> => {
  const { id } = options;
  
  const { data } = await soporteTecnicoApi.get<ItAsset>(`/it-assets/${id}`);  
  
  const BASE_URL = import.meta.env.VITE_API_URL;
  
  return {
    ...data,
    imageUrl: data.imageUrl ? `${BASE_URL}${data.imageUrl}` : null,
  };
}
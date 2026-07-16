import { soporteTecnicoApi, API_BASE_URL } from "@/api/soporteTecnicoApi"
import type { ItAsset } from "../interfaces/itAssetsResponse.interface";

interface Options {
  id: string;
}

export const getItAssetAction = async(options: Options): Promise<ItAsset> => {
  const { id } = options;
  
  const { data } = await soporteTecnicoApi.get<ItAsset>(`/it-assets/${id}`);  
  
  return {
    ...data,
    imageUrl: data.imageUrl ? `${API_BASE_URL}${data.imageUrl}` : null,
  };
}
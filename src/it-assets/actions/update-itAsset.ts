import { soporteTecnicoApi } from "@/api/soporteTecnicoApi"
import type { ItAsset } from "../interfaces/itAssetsResponse.interface";

interface Options {
  id: string;
}

export const updateItAssetAction = async (options: Options, formData: FormData): Promise<ItAsset> => {
  const { id } = options;
  const { data } = await soporteTecnicoApi.patch<ItAsset>(
    `/it-assets/${id}`, 
    formData, 
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  );  
  
  return data;
}
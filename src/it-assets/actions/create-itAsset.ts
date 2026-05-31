import { soporteTecnicoApi } from "@/api/soporteTecnicoApi"
import type { ItAsset } from "../interfaces/itAssetsResponse.interface";

// Ahora recibimos directamente un objeto FormData en lugar de una interfaz Options
export const createItAssetAction = async (formData: FormData): Promise<ItAsset> => {
  const { data } = await soporteTecnicoApi.post<ItAsset>(
    '/it-assets', 
    formData, 
    {
      headers: {
        // Le indicamos explícitamente a Axios que estamos enviando archivos y texto mezclados
        'Content-Type': 'multipart/form-data'
      }
    }
  );  
  
  return data;
}
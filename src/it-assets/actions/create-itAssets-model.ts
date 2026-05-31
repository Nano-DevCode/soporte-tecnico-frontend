import { soporteTecnicoApi } from "@/api/soporteTecnicoApi"
import type { Model } from "../interfaces/itAssetsModelsResponse.interrface";

interface Options {
  name: string;
  brandId: string;
}

export const createItAssetsModelAction = async(options: Options):Promise<Model> => {
  const { name, brandId } = options;
  const { data } = await soporteTecnicoApi.post<Model>('/it-assets-models', {
    name: name,
    brandId: brandId,
  });  
  return data;
}
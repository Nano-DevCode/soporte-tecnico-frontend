import { soporteTecnicoApi } from "@/api/soporteTecnicoApi"
import type { Model } from "../interfaces/toolsModelsResponse.interrface";

interface Options {
  name: string;
  brandId: string;
}

export const createToolsModelAction = async(options: Options):Promise<Model> => {
  const { name, brandId } = options;
  const { data } = await soporteTecnicoApi.post<Model>('/tools-models', {
    name: name,
    brandId: brandId,
  });  
  return data;
}
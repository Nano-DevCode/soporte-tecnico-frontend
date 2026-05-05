import { soporteTecnicoApi } from "@/api/soporteTecnicoApi"
import type { ToolModel } from "../interfaces/toolModelsResponse";

interface Options {
  name: string;
  brandId?: string;
}

export const createToolModelsActions = async(options: Options):Promise<ToolModel> => {
  const { name, brandId } = options;
  const { data } = await soporteTecnicoApi.post<ToolModel>('/tool-models',
    {
      name: name,
      brandId: brandId ?? ''
    }
  );  
  return data;
}
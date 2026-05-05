import { soporteTecnicoApi } from "@/api/soporteTecnicoApi"
import type { Tool } from "../interfaces/toolsResponse";

interface Options {
  quantity: number,
  description: string,
  modelId: string,
  typeId: string
}

export const createToolsActions = async(options: Options):Promise<Tool> => {
  const { quantity, description, modelId, typeId } = options;
  const { data } = await soporteTecnicoApi.post<Tool>('/tools',
    {
      quantity: quantity,
      description: description,
      modelId: modelId,
      typeId: typeId
    }
  );  
  return data;
}
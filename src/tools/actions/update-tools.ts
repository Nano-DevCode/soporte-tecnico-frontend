import { soporteTecnicoApi } from "@/api/soporteTecnicoApi"
import type { Tool } from "../interfaces/toolsResponse";

interface Options {
  id: string,
  quantity: number,
  description: string,
  modelId: string,
  typeId: string
}

export const updateToolsActions = async(options: Options):Promise<Tool> => {
  const { quantity, description, modelId, typeId, id } = options;
  const { data } = await soporteTecnicoApi.patch<Tool>(`/tools/${id}`,
    {
      quantity: quantity,
      description: description,
      modelId: modelId,
      typeId: typeId
    }
  );  
  return data;
}
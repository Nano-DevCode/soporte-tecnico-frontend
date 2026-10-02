import { soporteTecnicoApi } from "@/api/soporteTecnicoApi"
import type { ToolsModelsResponse } from "../interfaces/toolsModelsResponse.interrface";

interface Options {
  offset?: number | string;
  limit?: number | string;
  query?: string;
  modelId?: string;
}

export const getToolsModelsAction = async(options: Options):Promise<ToolsModelsResponse> => {
  const { limit = 10, offset = 0, query = undefined, modelId = undefined} = options;
  const { data } = await soporteTecnicoApi.get<ToolsModelsResponse>('/tools-models', {
    params: {
      limit: limit ? limit : undefined,
      offset: offset ? offset : undefined,
      query: query ? query : undefined,
      ...(modelId && { modelId })
    }
  });  
  return data;
}
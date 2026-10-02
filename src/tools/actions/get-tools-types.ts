import { soporteTecnicoApi } from "@/api/soporteTecnicoApi"
import type { ToolsTypesResponse } from "../interfaces/toolsTypesResponse.interface";

interface Options {
  offset?: number | string;
  limit?: number | string;
  query?: string;
}

export const getToolsTypesAction = async(options: Options):Promise<ToolsTypesResponse> => {
  const { limit = 10, offset = 0, query = undefined } = options;
  const { data } = await soporteTecnicoApi.get<ToolsTypesResponse>('/tools-types', {
    params: {
      limit: limit ? limit : undefined,
      offset: offset ? offset : undefined,
      query: query ? query : undefined,
    }
  });  
  return data;
}
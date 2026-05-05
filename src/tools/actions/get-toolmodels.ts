import { soporteTecnicoApi } from "@/api/soporteTecnicoApi"
import type { ToolModelsResponse } from "../interfaces/toolModelsResponse";

interface Options {
  limit?: number | string;
  offset?: number | string;
  query?: string;
  brandId?: string;
}

export const getToolModelsActions = async(options: Options):Promise<ToolModelsResponse> => {
  const { limit = 10, offset = 0, query, brandId } = options;
  const { data } = await soporteTecnicoApi.get<ToolModelsResponse>('/tool-models', {
    params: {
      limit,
      offset,
      query: query ? query.trim() : undefined,
      brandId: brandId
    },
  });   
  return data;
}
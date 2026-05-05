import { soporteTecnicoApi } from "@/api/soporteTecnicoApi"
import type { ToolBrandsResponse } from "../interfaces/toolBrandsResponse";

interface Options {
  limit?: number | string;
  offset?: number | string;
  query?: string;
}

export const getToolBrandsActions = async(options: Options):Promise<ToolBrandsResponse> => {
  const { limit = 10, offset = 0, query = undefined } = options;
  const { data } = await soporteTecnicoApi.get<ToolBrandsResponse>('/tool-brands',
    {
      params: {
        limit: isNaN(Number(limit)) ? 10 : Number(limit),
        offset: isNaN(Number(offset)) ? 0 : Number(offset),
        query: query?.replaceAll('+', ' ')
      },
    }
  );  
  return data;
}
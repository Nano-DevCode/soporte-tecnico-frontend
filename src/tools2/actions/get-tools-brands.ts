import { soporteTecnicoApi } from "@/api/soporteTecnicoApi"
import type { ToolsBrandsResponse } from "../interfaces/toolsBrandsResponse.interfaces";

interface Options {
  offset?: number | string;
  limit?: number | string;
  query?: string;
}

export const getToolsBrandsAction = async(options: Options):Promise<ToolsBrandsResponse> => {
  const { limit = 10, offset = 0, query = undefined } = options;
  const { data } = await soporteTecnicoApi.get<ToolsBrandsResponse>('/tools-brands', {
    params: {
      limit: limit ? limit : undefined,
      offset: offset ? offset : undefined,
      query: query ? query : undefined,
    }
  });  
  return data;
}
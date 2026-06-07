import { soporteTecnicoApi } from "@/api/soporteTecnicoApi"
import type { ItAssetsBrandsResponse } from "../interfaces/itAssetsBrandsResponse.interfaces";

interface Options {
  offset?: number | string;
  limit?: number | string;
  query?: string;
}

export const getItAssetsBrandsAction = async(options: Options):Promise<ItAssetsBrandsResponse> => {
  const { limit = 10, offset = 0, query = undefined } = options;
  const { data } = await soporteTecnicoApi.get<ItAssetsBrandsResponse>('/it-assets-brands', {
    params: {
      limit: limit ? limit : undefined,
      offset: offset ? offset : undefined,
      query: query ? query : undefined,
    }
  });  
  return data;
}
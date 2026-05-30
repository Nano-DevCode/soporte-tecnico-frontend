import { soporteTecnicoApi } from "@/api/soporteTecnicoApi"
import type { ItAssetsTypesResponse } from "../interfaces/itAssetsTypesResponse.interface";

interface Options {
  offset?: number | string;
  limit?: number | string;
  query?: string;
}

export const getItAssetsTypesAction = async(options: Options):Promise<ItAssetsTypesResponse> => {
  const { limit = 10, offset = 0, query = undefined } = options;
  const { data } = await soporteTecnicoApi.get<ItAssetsTypesResponse>('/it-assets-types', {
    params: {
      limit: limit ? limit : undefined,
      offset: offset ? offset : undefined,
      query: query ? query : undefined,
    }
  });  
  return data;
}
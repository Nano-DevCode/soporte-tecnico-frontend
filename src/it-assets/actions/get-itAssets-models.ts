import { soporteTecnicoApi } from "@/api/soporteTecnicoApi"
import type { ItAssetsModelsResponse } from "../interfaces/itAssetsModelsResponse.interrface";

interface Options {
  offset?: number | string;
  limit?: number | string;
  query?: string;
  modelId?: string;
}

export const getItAssetsModelsAction = async(options: Options):Promise<ItAssetsModelsResponse> => {
  const { limit = 10, offset = 0, query = undefined, modelId = undefined} = options;
  const { data } = await soporteTecnicoApi.get<ItAssetsModelsResponse>('/it-assets-models', {
    params: {
      limit: limit ? limit : undefined,
      offset: offset ? offset : undefined,
      query: query ? query : undefined,
      ...(modelId && { modelId })
    }
  });  
  return data;
}
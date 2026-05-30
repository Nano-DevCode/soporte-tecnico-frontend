import { soporteTecnicoApi } from "@/api/soporteTecnicoApi"
import type { ItAssetsResponse } from "../interfaces/itAssetsResponse.interface";

interface Options {
  itAssetId: string;
  itAssetsStatusId: string;
  observations?: string;
}

export const createItAssetsMovementInAction = async(options: Options):Promise<ItAssetsResponse> => {
  const { itAssetId, itAssetsStatusId, observations = undefined } = options;
  const { data } = await soporteTecnicoApi.post<ItAssetsResponse>('/it-assets-movements-in',
    {
      itAssetId: itAssetId,
      itAssetsStatusId: itAssetsStatusId,
      observations: observations
    }
  );  
  return data;
}
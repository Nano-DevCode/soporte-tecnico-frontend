import { soporteTecnicoApi } from "@/api/soporteTecnicoApi"
import type { ItAssetsMovementIn } from "../interfaces/itAssetsMovementInResponse";

interface Options {
  itAssetId: string;
  itAssetsStatusId: string;
  observations?: string;
}

export const createItAssetsMovementInAction = async(options: Options): Promise<ItAssetsMovementIn> => {
  const { itAssetId, itAssetsStatusId, observations } = options;
  
  const { data } = await soporteTecnicoApi.post<ItAssetsMovementIn>('/it-assets-movements-in',
    {
      itAssetId,
      itAssetsStatusId,
      ...(observations && { observations }),
    }
  );  
  return data;
}
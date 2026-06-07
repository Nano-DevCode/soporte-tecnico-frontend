import { soporteTecnicoApi } from "@/api/soporteTecnicoApi"
import type { ItAsset } from "../interfaces/itAssetsResponse.interface";

interface Options {
  id: string;
  status: boolean;
}

export const changeStatusItAssetAction = async (options: Options): Promise<ItAsset> => {
  const { id, status } = options;
  const { data } = await soporteTecnicoApi.patch<ItAsset>(
    `/it-assets/change-status/${id}`, {
        status
    }
  );  
  
  return data;
}
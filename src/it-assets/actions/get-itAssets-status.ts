import { soporteTecnicoApi } from "@/api/soporteTecnicoApi"
import type { ItAssetsStatusResponse } from "../interfaces/itAssetsStatusResponse.interface";

export const getItAssetsStatusAction = async():Promise<ItAssetsStatusResponse> => {
  const { data } = await soporteTecnicoApi.get<ItAssetsStatusResponse>('/it-assets-status',
  );  
  return data;
}
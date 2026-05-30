import { soporteTecnicoApi } from "@/api/soporteTecnicoApi"
import type { ItAssetsTypesResponse } from "../interfaces/itAssetsTypesResponse.interface";

interface Options {
  name: string;
}

export const getItAssetsTypesAction = async(options: Options):Promise<ItAssetsTypesResponse> => {
  const { name } = options;
  const { data } = await soporteTecnicoApi.post<ItAssetsTypesResponse>('/it-assets-types', {
    name: name,
  });  
  return data;
}
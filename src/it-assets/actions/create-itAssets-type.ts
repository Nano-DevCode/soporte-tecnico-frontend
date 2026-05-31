import { soporteTecnicoApi } from "@/api/soporteTecnicoApi"
import type { ItAssetsType } from "../interfaces/itAssetsTypesResponse.interface";

interface Options {
  name: string;
}

export const createItAssetsTypeAction = async(options: Options):Promise<ItAssetsType> => {
  const { name } = options;
  const { data } = await soporteTecnicoApi.post<ItAssetsType>('/it-assets-types', {
    name: name,
  });  
  return data;
}
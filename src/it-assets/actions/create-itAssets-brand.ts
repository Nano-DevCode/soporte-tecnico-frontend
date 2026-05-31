import { soporteTecnicoApi } from "@/api/soporteTecnicoApi"
import type { Brand } from "../interfaces/itAssetsBrandsResponse.interfaces";

interface Options {
  name: string;
}

export const createItAssetsBrandAction = async(options: Options):Promise<Brand> => {
  const { name } = options;
  const { data } = await soporteTecnicoApi.post<Brand>('/it-assets-brands', {
    name: name
  });  
  return data;
}
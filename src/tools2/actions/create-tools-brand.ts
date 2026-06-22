import { soporteTecnicoApi } from "@/api/soporteTecnicoApi"
import type { Brand } from "../interfaces/toolsBrandsResponse.interfaces";

interface Options {
  name: string;
}

export const createToolsBrandAction = async(options: Options):Promise<Brand> => {
  const { name } = options;
  const { data } = await soporteTecnicoApi.post<Brand>('/tools-brands', {
    name: name
  });  
  return data;
}
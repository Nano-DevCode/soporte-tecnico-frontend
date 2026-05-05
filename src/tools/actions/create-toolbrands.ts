import { soporteTecnicoApi } from "@/api/soporteTecnicoApi"
import type { ToolBrand } from "../interfaces/toolBrandsResponse";

interface Options {
  name: string
}

export const createToolBrandsActions = async(options: Options):Promise<ToolBrand> => {
  const { name } = options;
  const { data } = await soporteTecnicoApi.post<ToolBrand>('/tool-brands',
    {
      name: name
    }
  );  
  return data;
}
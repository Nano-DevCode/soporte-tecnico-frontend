import { soporteTecnicoApi } from "@/api/soporteTecnicoApi"
import type { ToolsType } from "../interfaces/toolsTypesResponse.interface";

interface Options {
  name: string;
}

export const createToolsTypeAction = async(options: Options):Promise<ToolsType> => {
  const { name } = options;
  const { data } = await soporteTecnicoApi.post<ToolsType>('/tools-types', {
    name: name,
  });  
  return data;
}
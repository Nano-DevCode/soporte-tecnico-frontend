import { soporteTecnicoApi } from "@/api/soporteTecnicoApi"
import type { ToolTypes } from "../interfaces/toolTypesResponse";

interface Options {
  name: string
}

export const createToolTypesActions = async(options: Options):Promise<ToolTypes> => {
  const { name } = options;
  const { data } = await soporteTecnicoApi.post<ToolTypes>('/tool-types',
    {
      name: name
    }
  );  
  return data;
}
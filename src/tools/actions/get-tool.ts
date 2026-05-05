import { soporteTecnicoApi } from "@/api/soporteTecnicoApi"
import type { Tool } from "../interfaces/toolsResponse";

interface Options {
  id: string;
}

export const getOneToolActions = async(options: Options):Promise<Tool> => {
  const { id } = options;
  const { data } = await soporteTecnicoApi.get<Tool>(`/tools/${id}`);  
  return data;
}
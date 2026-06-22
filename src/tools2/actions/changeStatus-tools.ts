import { soporteTecnicoApi } from "@/api/soporteTecnicoApi"
import type { Tool } from "../interfaces/toolsResponse.interface";

interface Options {
  id: string;
  status: boolean;
}

export const changeStatusToolAction = async (options: Options): Promise<Tool> => {
  const { id, status } = options;
  const { data } = await soporteTecnicoApi.patch<Tool>(
    `/tools/change-status/${id}`, {
        status
    }
  );  
  
  return data;
}
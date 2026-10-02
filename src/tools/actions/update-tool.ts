import { soporteTecnicoApi } from "@/api/soporteTecnicoApi"
import type { Tool } from "../interfaces/toolsResponse.interface";

interface Options {
  id: string;
}

export const updateToolAction = async (options: Options, formData: FormData): Promise<Tool> => {
  const { id } = options;
  const { data } = await soporteTecnicoApi.patch<Tool>(
    `/tools/${id}`, 
    formData, 
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  );  
  
  return data;
}
import { soporteTecnicoApi } from "@/api/soporteTecnicoApi"
import type { Tool } from "../interfaces/toolsResponse.interface";

// Ahora recibimos directamente un objeto FormData en lugar de una interfaz Options
export const createToolAction = async (formData: FormData): Promise<Tool> => {
  const { data } = await soporteTecnicoApi.post<Tool>(
    '/tools', 
    formData, 
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  );  
  
  return data;
}
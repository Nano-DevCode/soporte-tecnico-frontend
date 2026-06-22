import { soporteTecnicoApi } from "@/api/soporteTecnicoApi"
import type { Tool } from "../interfaces/toolsResponse.interface"; // Verifica que esta ruta exista

interface Options {
  id: string;
}

export const getToolAction = async(options: Options): Promise<Tool> => {
  const { id } = options;
  
  const { data } = await soporteTecnicoApi.get<Tool>(`/tools/${id}`);  
  
  const BASE_URL = import.meta.env.VITE_API_URL;
  
  return {
    ...data,
    imageUrl: data.imageUrl ? `${BASE_URL}${data.imageUrl}` : null,
  };
}
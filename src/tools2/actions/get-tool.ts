import { soporteTecnicoApi, API_BASE_URL } from "@/api/soporteTecnicoApi"
import type { Tool } from "../interfaces/toolsResponse.interface";

interface Options {
  id: string;
}

export const getToolAction = async(options: Options): Promise<Tool> => {
  const { id } = options;
  
  const { data } = await soporteTecnicoApi.get<Tool>(`/tools/${id}`);  
  
  return {
    ...data,
    imageUrl: data.imageUrl ? `${API_BASE_URL}${data.imageUrl}` : null,
  };
}
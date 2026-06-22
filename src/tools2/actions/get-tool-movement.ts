import { soporteTecnicoApi } from "@/api/soporteTecnicoApi"
import type { ToolsMovement } from '../interfaces/toolsMovementResponse';

export const getToolsMovementAction = async (id: string): Promise<ToolsMovement> => {
  const { data } = await soporteTecnicoApi.get<ToolsMovement>(`/tools-movements/${id}`);  
  
  const baseUrl = import.meta.env.VITE_API_URL;
  
  if (data.tool?.imageUrl && !data.tool.imageUrl.startsWith('http')) {
    data.tool.imageUrl = `${baseUrl}${data.tool.imageUrl}`;
  }

  return data;
}
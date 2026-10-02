import { soporteTecnicoApi, API_BASE_URL } from "@/api/soporteTecnicoApi"
import type { ToolsMovement } from '../interfaces/toolsMovementResponse';

export const getToolsMovementAction = async (id: string): Promise<ToolsMovement> => {
  const { data } = await soporteTecnicoApi.get<ToolsMovement>(`/tools-movements/${id}`);  
  
  if (data.tool?.imageUrl && !data.tool.imageUrl.startsWith('http')) {
    data.tool.imageUrl = `${API_BASE_URL}${data.tool.imageUrl}`;
  }

  return data;
}
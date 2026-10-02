import { soporteTecnicoApi, API_BASE_URL } from "@/api/soporteTecnicoApi"
import type { ToolsMovementResponse } from "../interfaces/toolsMovementResponse";

interface Options {
  offset?: number;
  limit?: number;
  query?: string;
  type?: string;
  startDate?: string;
  endDate?: string;
}

export const getToolsMovementsAction = async (options: Options): Promise<ToolsMovementResponse> => {
  const { data } = await soporteTecnicoApi.get<ToolsMovementResponse>('/tools-movements', {
    params: options 
  });  

  const mappedMovements = data.toolsMovements.map(movement => {
    if (movement.tool?.imageUrl && !movement.tool.imageUrl.startsWith('http')) {
      movement.tool.imageUrl = `${API_BASE_URL}${movement.tool.imageUrl}`;
    }
    
    return movement;
  });

  return {
    ...data,
    toolsMovements: mappedMovements
  };
}
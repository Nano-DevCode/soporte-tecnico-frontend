import { soporteTecnicoApi } from "@/api/soporteTecnicoApi"
import type { ToolsMovementIn } from "../interfaces/toolsMovementInResponse";

interface Options {
  toolId: string;
  toolsStatusId: string;
  observations?: string;
}

export const createToolsMovementInAction = async(options: Options): Promise<ToolsMovementIn> => {
  const { toolId, toolsStatusId, observations } = options;
  
  const { data } = await soporteTecnicoApi.post<ToolsMovementIn>('/tools-movements-in',
    {
      toolId,
      toolsStatusId,
      ...(observations && { observations }),
    }
  );  
  return data;
}
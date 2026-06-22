import { soporteTecnicoApi } from "@/api/soporteTecnicoApi"
import type { ToolsStatusResponse } from "../interfaces/toolsStatusResponse.interface";

export const getToolsStatusAction = async():Promise<ToolsStatusResponse> => {
  const { data } = await soporteTecnicoApi.get<ToolsStatusResponse>('/tools-status',
  );  
  return data;
}
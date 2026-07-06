import { soporteTecnicoApi } from "@/api/soporteTecnicoApi"
import type { ToolsMovementOut } from "../interfaces/toolsMovementOutResponse";

interface Options {
  toolId: string;
  toolStatusId: string;
  observations?: string;
  description?: string;
  voucher?: string;
  staffId?: string;
  ticketId?: string;
}

export const createToolsMovementOutAction = async(options: Options): Promise<ToolsMovementOut> => {
  const { 
    toolId,
    toolStatusId ,
    observations, 
    description, 
    voucher, 
    staffId, 
    ticketId 
  } = options;

  const { data } = await soporteTecnicoApi.post<ToolsMovementOut>(
    '/tools-movements-out',
    {
      toolId: toolId,
      toolStatusId:  toolStatusId,
      ...(observations && { observations }),
      ...(description && { description }),
      ...(voucher && { voucher }),
      ...(staffId && { staffId }),
      ...(ticketId && { ticketId }),
    }
  );  
  
  return data;
}
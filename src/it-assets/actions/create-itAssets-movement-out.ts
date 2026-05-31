import { soporteTecnicoApi } from "@/api/soporteTecnicoApi"
import type { ItAssetsMovementOut } from "../interfaces/itAssetsMovementOutResponse";

interface Options {
  itAssetId: string;
  itAssetsStatusId: string;
  observations?: string;
  description?: string;
  voucher?: string;
  staffId?: string;
  ticketId?: string;
}

export const createItAssetsMovementOutAction = async(options: Options): Promise<ItAssetsMovementOut> => {
  const { 
    itAssetId, 
    itAssetsStatusId, 
    observations, 
    description, 
    voucher, 
    staffId, 
    ticketId 
  } = options;

  const { data } = await soporteTecnicoApi.post<ItAssetsMovementOut>(
    '/it-assets-movements-out',
    {
      itAssetId,
      itAssetsStatusId,
      ...(observations && { observations }),
      ...(description && { description }),
      ...(voucher && { voucher }),
      ...(staffId && { staffId }),
      ...(ticketId && { ticketId }),
    }
  );  
  
  return data;
}
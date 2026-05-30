import { soporteTecnicoApi } from "@/api/soporteTecnicoApi"
import type { ItAssetsResponse } from "../interfaces/itAssetsResponse.interface";

interface Options {
  itAssetId: string;
  itAssetsStatusId: string;
  observations?: string;
  description?: string;
  voucher?: string;
  staffId?: string;
  ticketId?: string;
}

export const createItAssetsMovementOutAction = async(options: Options):Promise<ItAssetsResponse> => {
  const { itAssetId, itAssetsStatusId, observations = undefined, description = undefined, voucher = undefined, staffId = undefined, ticketId = undefined} = options;
  const { data } = await soporteTecnicoApi.post<ItAssetsResponse>('/it-assets-movements-out',
    {
      itAssetId: itAssetId,
      itAssetsStatusId: itAssetsStatusId,
      observations: observations,
      description: description,
      voucher: voucher,
      staffId: staffId,
      ticketId: ticketId,
    }
  );  
  return data;
}
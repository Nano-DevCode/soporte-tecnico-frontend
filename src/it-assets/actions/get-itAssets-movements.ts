import { soporteTecnicoApi, API_BASE_URL } from "@/api/soporteTecnicoApi"
import type { ItAssetsMovementResponse } from "../interfaces/itAssetsMovementResponse";

interface Options {
  offset?: number;
  limit?: number;
  query?: string;
  type?: string;
  startDate?: string;
  endDate?: string;
}

export const getItAssetsMovementsAction = async (options: Options): Promise<ItAssetsMovementResponse> => {
  const { data } = await soporteTecnicoApi.get<ItAssetsMovementResponse>('/it-assets-movements', {
    params: options 
  });  

  const mappedMovements = data.itAssetsMovements.map(movement => {
    if (movement.itAsset?.imageUrl && !movement.itAsset.imageUrl.startsWith('http')) {
      movement.itAsset.imageUrl = `${API_BASE_URL}${movement.itAsset.imageUrl}`;
    }
    
    return movement;
  });

  return {
    ...data,
    itAssetsMovements: mappedMovements
  };
}
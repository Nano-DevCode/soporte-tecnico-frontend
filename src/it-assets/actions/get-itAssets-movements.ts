import { soporteTecnicoApi } from "@/api/soporteTecnicoApi"
import type { ItAssetsMovementResponse } from "../interfaces/itAssetsMovementResponse";

interface Options {
  offset?: number | string;
  limit?: number | string;
  query?: string;
}

export const getItAssetsMovementsAction = async(options: Options):Promise<ItAssetsMovementResponse> => {
  const { limit = 10, offset = 0, query = undefined } = options;
  const { data } = await soporteTecnicoApi.get<ItAssetsMovementResponse>('/it-assets-movements', {
    params: {
      limit: limit ? limit : undefined,
      offset: offset ? offset : undefined,
      query: query ? query : undefined,
    }
  });  

  const baseUrl = import.meta.env.VITE_API_URL;

  const mappedMovements = data.itAssetsMovements.map(movement => {
    movement.itAsset.imageUrl = `${baseUrl}${movement.itAsset.imageUrl}`;
    
    return movement;
  });

  return {
    ...data,
    itAssetsMovements: mappedMovements
  };
}
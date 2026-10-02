import { soporteTecnicoApi, getBaseUrl } from "../../api/soporteTecnicoApi";
import type { ConsumablesResponse } from '../interfaces/consumable.interfaces';

interface GetConsumablesOptions {
  query?: string;
  limit?: number | string;
  offset?: number | string;
  id_type_consumable?: number | string;
  id_unit_measurement?: number | string;
  id_ubication_consumable?: string;
}

export const getConsumablesAction = async (
  options: GetConsumablesOptions
): Promise<ConsumablesResponse> => {
  const {
    limit = 10,
    offset = 0,
    query,
    id_type_consumable,
    id_unit_measurement,
    id_ubication_consumable,
  } = options;

  try {
    const { data } = await soporteTecnicoApi.get<ConsumablesResponse>('/consumables', {
      params: {
        query: query && query.trim() !== '' ? query.trim() : undefined,
        limit: isNaN(Number(limit)) ? 10 : Number(limit),
        offset: isNaN(Number(offset)) ? 0 : Number(offset),
        id_type_consumable: id_type_consumable || undefined,
        id_unit_measurement: id_unit_measurement || undefined,
        id_ubication_consumable: id_ubication_consumable || undefined,
      },
    });

    const responseData = data?.consumables || [];
    const responseMeta = data?.meta || { total: 0, page: 1, lastPage: 1 };
    
    const BASE_URL = getBaseUrl(); 

    const consumablesWithImages = responseData.map((consumable) => {
      let finalImageUrl = consumable.imageUrl || null;
      if (finalImageUrl && !finalImageUrl.startsWith("http://") && !finalImageUrl.startsWith("https://")) {
        const cleanPath = finalImageUrl.startsWith("/") ? finalImageUrl : `/${finalImageUrl}`;
        finalImageUrl = `${BASE_URL}${cleanPath}`;
      }
      return {
        ...consumable,
        imageUrl: finalImageUrl,
      };
    });

    return {
      consumables: consumablesWithImages,
      meta: {
        total: Number(responseMeta.total),
        page: Number(responseMeta.page),
        lastPage: Number(responseMeta.lastPage),
      },
    };

  } catch {
    //console.error(t("api_consumables_fetch_error"), error);
    return {
      consumables: [],
      meta: { 
        total: 0, 
        lastPage: 1, 
        page: Math.floor(Number(offset) / Number(limit)) + 1 
      },
    };
  }
};
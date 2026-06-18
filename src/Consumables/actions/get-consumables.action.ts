import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";
import { t } from "i18next";

export interface ConsumableItem {
  id: string;
  item_code: string;
  description: string;
  number_uses: number;
  imageUrl?: string | null;
  id_brand_consumable: { id: string; name: string };
  id_type_consumable: { id: number; name: string };
  id_unit_measurement: { id: number; name: string };
  id_ubication_consumable: { id: string; name: string };
  created_at: string;
  updated_at: string;
  available_stock: number;
}
interface GetConsumablesOptions {
  search?: string;
  limit?: number | string;
  offset?: number | string;
  id_type_consumable?: number | string;
  id_unit_measurement?: number | string;
  id_ubication_consumable?: string;
}

export const getConsumablesAction = async (options: GetConsumablesOptions) => {
  const {
    limit = 10,
    offset = 0,
    search,
    id_type_consumable,
    id_unit_measurement,
    id_ubication_consumable
  } = options;

  try {
    const { data } = await soporteTecnicoApi.get('/consumables', {
      
      params: {
        query: search && search.trim() !== '' ? search.trim() : undefined,
        limit: isNaN(Number(limit)) ? 10 : Number(limit),
        offset: isNaN(Number(offset)) ? 0 : Number(offset),
        id_type_consumable: id_type_consumable || undefined,
        id_unit_measurement: id_unit_measurement || undefined,
        id_ubication_consumable: id_ubication_consumable || undefined,
      }
    });

    const responseData = data?.consumables || [];
    const responseMeta = data?.meta || { total: 0, page: 1, lastPage: 1 };
    const BASE_URL = import.meta.env.VITE_API_URL;

    const consumablesWithImages = responseData.map((consumable: ConsumableItem) => ({
      ...consumable,
      imageUrl: consumable.imageUrl ? `${BASE_URL}${consumable.imageUrl}` : null
    }));

    return {
      consumables: consumablesWithImages as ConsumableItem[],
      meta: responseMeta
    };

  } catch (error) {
    console.error(t("api_consumables_fetch_error"), error);
    return {
      consumables: [],
      meta: { total: 0, lastPage: 1, page: 1 }
    };
  }
};
// import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";
// import { t } from "i18next";

// export interface ConsumableItem {
//   id: string;
//   item_code: string;
//   description: string;
//   number_uses: number;
//   imageUrl?: string | null;
//   id_brand_consumable: { id: string; name: string };
//   id_type_consumable: { id: number; name: string };
//   id_unit_measurement: { id: number; name: string };
//   id_ubication_consumable: { id: string; name: string };
//   created_at: string;
//   updated_at: string;
//   available_stock: number;
// }


// interface GetConsumablesOptions {
//   search?: string;
//   limit?: number | string;
//   offset?: number | string;
// }

// export const getConsumablesAction = async (options: GetConsumablesOptions) => {
//   const { limit = 10, offset = 0, search } = options;

//   try {
//     const { data } = await soporteTecnicoApi.get('/consumables', {
//       params: {
//         query: search && search.trim() !== '' ? search.trim() : undefined,
//         limit: isNaN(Number(limit)) ? 10 : Number(limit),
//         offset: isNaN(Number(offset)) ? 0 : Number(offset),
//       }
//     });

//     const responseData = data?.consumables || [];
//     const responseMeta = data?.meta || { total: 0, page: 1, lastPage: 1 };
//     const BASE_URL = import.meta.env.VITE_API_URL;

//     const consumablesWithImages = responseData.map((consumable: ConsumableItem) => ({
//       ...consumable,
//       imageUrl: consumable.imageUrl ? `${BASE_URL}${consumable.imageUrl}` : null
//     }));

//     return {
//       consumables: consumablesWithImages as ConsumableItem[],
//       meta: responseMeta
//     };

//   } catch (error) {
//     console.error(t("api_consumables_fetch_error"), error);
//     return {
//       consumables: [],
//       meta: { total: 0, lastPage: 1, page: 1 }
//     };
//   }
// };
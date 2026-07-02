import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";
// import { t } from "i18next";
import type { Consumable } from "../interfaces/consumable.interfaces"; 
import type { BatchProductItem } from "./get-batches-consumables";
import type { Department } from "./get-departament.actions";
import type { GroupedMovement } from "../interfaces/consumable-movement.interfaces";

export interface MovementsConsumableItem {
  id: string;
  id_movement_aplication: CatalogItem;
  id_movement_type: CatalogItem; 
  id_movement_application: CatalogItem; 
  id_ticket: CatalogItem;
  id_departament_consumable: Department; 
  code_movement_aplication: string;
  quantity_consumable: string | number;
  observations: string;
  movement_cost: string | number; 
  created_at: string; 
  updated_at: string;
  batch?: BatchProductItem;
  consumable?: Consumable;
  id_batches_product?: BatchProductItem; 
  id_consumable?: Consumable; 
}

export interface CatalogItem {
  id: string | number;
  name: string;
}
interface GetMovementConsumablesOptions {
  search?: string; 
  limit: number;
  offset: number;
  id_movement_type?: number | string;       // id del tipo de movimiento (1 o 2)
  id_movement_aplication?: number | string; // id de la aplicación (1, 2, 3, etc)
  id_departament_consumable?: string;       // uuid del departamento
  startDate?: string;                       // Fecha de inicio formato YYYY-MM-DD
  endDate?: string;                         //  Fecha final formato YYYY-MM-DD
}

export const getMovementConsumablesAction = async (options: GetMovementConsumablesOptions) => {
  const { 
    limit, 
    offset, 
    search, 
    id_movement_type, 
    id_movement_aplication, 
    id_departament_consumable, 
    startDate, 
    endDate 
  } = options;

  try {
    const url = '/consumable-movements';

    const response = await soporteTecnicoApi.get(url, {
      params: {
        query: search && search.trim() !== '' ? search.trim() : undefined,
        limit,
        offset,
        id_movement_type: id_movement_type || undefined,
        id_movement_aplication: id_movement_aplication || undefined,
        id_departament_consumable: id_departament_consumable || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      }
    });

    const responseData = response.data?.movements || [];
    const responseMeta = response.data?.meta || { total: 0, page: 1, lastPage: 1 };

    return {
      data: responseData as GroupedMovement[],
      meta: responseMeta
    };

  } catch {
    // console.error(t("api_batches_fetch_error"), error);
    return {
      data: [],
      meta: { total: 0, lastPage: 1, page: 1 }
    };
  }
};
// --- ACCIÓN 2: OBTENER EL DESGLOSE DE UN MOVIMIENTO AGRUPADO POR SU FOLIO/CÓDIGO ---
export const getMovementConsumableByIdAction = async (code: string) => {
  try {
    const url = `/consumable-movements/summary/${encodeURIComponent(code)}`;
    const response = await soporteTecnicoApi.get<GroupedMovement>(url);

    return response.data;
  } catch {
    return null; 
  }
};
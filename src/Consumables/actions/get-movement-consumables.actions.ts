import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";
import { t } from "i18next";
import type { ConsumableItem } from "./get-consumables.action"; 
import type { BatchProductItem } from "./get-batches-consumables";
import type { Department } from "./get-departament.actions";
import type { GroupedMovement } from "../interfaces/consumable-movement.interfaces";

export interface MovementsConsumableItem {
  id_movement_aplication: CatalogItem;
  id: string;
  id_batches_product: BatchProductItem; 
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
  id_consumable: ConsumableItem; 
}

export interface CatalogItem {
  id: string | number;
  name: string;
}

// 🌟 Interfaz extendida para soportar los nuevos filtros del backend
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

    // 🌟 Mantenemos tu estructura de retorno, pero asignándole el tipo correcto (GroupedMovement)
    const responseData = response.data?.movements || [];
    const responseMeta = response.data?.meta || { total: 0, page: 1, lastPage: 1 };

    return {
      data: responseData as GroupedMovement[], // 🌟 Cambiado a tu interfaz de la UI agrupada
      meta: responseMeta
    };

  } catch (error) {
    console.error(t("api_batches_fetch_error"), error);
    return {
      data: [],
      meta: { total: 0, lastPage: 1, page: 1 }
    };
  }
};

// --- ACCIÓN 2: OBTENER UN SOLO LOTE POR SU ID ---
export const getMovementConsumableByIdAction = async (id: string) => {
  try {
    const url = `/consumable-movements/${id}`;
    const response = await soporteTecnicoApi.get<MovementsConsumableItem>(url);

    return response.data;
  } catch (error) {
    console.error(t("api_batch_fetch_by_id_error"), error);
    throw error; 
  }
};
import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";
import { t } from "i18next";
import type { ConsumableItem } from "./get-consumables.action"; // Importa tu interfaz de consumibles existente
import type { BatchProductItem } from "./get-batches-consumables";
import type { Department } from "./get-departament.actions";

export interface MovementsConsumableItem {
  id: string;
  id_batches_product: BatchProductItem; // Cargado mediante leftJoinAndSelect
  id_movement_type: CatalogItem; // Cargado mediante leftJoinAndSelect
  id_movement_application: CatalogItem; // Cargado mediante leftJoinAndSelect 
  id_ticket: CatalogItem;
  id_departament_consumable: Department; // Cargado mediante leftJoinAndSelect
  code_movement_aplication: string;
  quantity_consumable: string | number;
  observations: number;
  movement_cost: string | number; // Llega como string ISO desde la API timestamptz
  created_at: string; // Llega como string ISO desde la API timestamptz
  updated_at: string;
  id_consumable: ConsumableItem; // Cargado mediante leftJoinAndSelect
}
export interface CatalogItem {
  id: string | number;
  name: string;
}
interface GetMovementConsumablesOptions {
  search?: string; // Mapea a la propiedad 'query' del FilterBatchesproductDto
  limit: number;
  offset: number;
}
export const getMovementConsumablesAction = async (options: GetMovementConsumablesOptions) => {
  const { limit, offset, search } = options;

  try {
    const url = '/consumable-movements';

    const response = await soporteTecnicoApi.get(url, {
      params: {
        // Tu backend espera 'query' tal como lo filtra en el QueryBuilder
        query: search && search.trim() !== '' ? search.trim() : undefined,
        limit,
        offset,
      }
    });

    const responseData = response.data?.movements || [];
    const responseMeta = response.data?.meta || { total: 0, page: 1, lastPage: 1 };

    return {
      data: responseData as MovementsConsumableItem[],
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
    throw error; // Lanzamos el error para manejar las excepciones (ej: 404) directamente en el componente
  }
};

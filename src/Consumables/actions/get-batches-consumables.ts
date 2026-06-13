import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";
import { t } from "i18next";
import type { ConsumableItem } from "./get-consumables.action"; // Importa tu interfaz de consumibles existente

export interface BatchProductItem {
  id: string;
  num_requirement: string;
  arrival_amount: number;
  quantity_consumable: number;
  available_stock: number;
  cost_batch: number;
  cost_unit: number;
  created_at: string;
  updated_at: string;
  id_consumable: ConsumableItem;
}

interface GetBatchesOptions {
  search?: string;
  limit: number;
  offset: number;
}

export const getBatchesProductsAction = async (options: GetBatchesOptions) => {
  const { limit, offset, search } = options;

  try {
    const url = '/batches-products';

    const response = await soporteTecnicoApi.get(url, {
      params: {
        // Sincronizado con tu FilterBatchesproductDto del backend
        query: search && search.trim() !== '' ? search.trim() : undefined,
        limit,
        offset,
      }
    });

    const responseData = response.data?.batches || [];
    const responseMeta = response.data?.meta || { total: 0, page: 1, lastPage: 1 };

    return {
      data: responseData as BatchProductItem[],
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

export const getBatchProductByIdAction = async (id: string) => {
  try {
    const url = `/batches-products/${id}`;
    const response = await soporteTecnicoApi.get<BatchProductItem>(url);
    
    return response.data;
  } catch (error) {
    console.error(t("api_batch_fetch_by_id_error"), error);
    throw error;
  }
};

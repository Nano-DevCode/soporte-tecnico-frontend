export interface CatalogItem {
  id: string | number;
  name: string;
}

export interface Consumable {
  consumableInfo: unknown;
  id: string;
  item_code: string;
  name: string;
  description: string;
  stockMin:number;
  stockMax:number;
  number_uses: number;
  imageUrl: string | null;
  available_stock: number;
  id_brand_consumable: CatalogItem;
  id_type_consumable: CatalogItem;
  id_unit_measurement: CatalogItem;
  id_ubication_consumable: CatalogItem;
  created_at?: string;
  updated_at?: string;
}

export interface ConsumablesResponse {
  consumables: Consumable[];
  meta: {
    total: number;
    page: number;
    lastPage: number;
  };
}

export interface FilterConsumableParams {
  limit?: number;
  offset?: number;
  query?: string;
}
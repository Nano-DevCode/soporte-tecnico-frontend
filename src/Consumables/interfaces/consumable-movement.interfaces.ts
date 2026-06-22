import type { Consumable } from "../interfaces/consumable.interfaces"; 
// import type { BatchProductItem } from "../actions/get-batches-consumables";
import type { Department } from "../actions/get-departament.actions";
import type { Ticket } from "@/tickets/interfaces/ticket.interface";

// interfaces/consumable-movement.interfaces.ts

export interface CatalogItem {
  id: string | number;
  name: string;
}

export interface MovementsConsumableItem {
  id: string | number;
  quantity_consumable: number;
  movement_cost: number;
  observations: string | null;
  batch: {
    id: string | number;
    num_requirement: string;
    cost_unit: number;
  } | null;
  consumable: Consumable | null;
}

// Interfaz para la UI con los datos acumulados por transacción
export interface GroupedMovement {
  code_movement_aplication: string;
  created_at: string;
  movement_type: CatalogItem;
  movement_aplication: CatalogItem;
  department?: Department;
  observations: string;
  total_quantity: number;
  total_cost: number;
  subItems: MovementsConsumableItem[]; // Sincronizado
  id_ticket?: Ticket;
}export interface ConsumableItemDto {
  id_consumable: string;
  quantity_consumable: number;
  description?: string; // Auxiliar para renderizar el nombre en el formulario
}

export interface CreateConsumableMovementDto {
  id_movement_aplication: number; // 2: Ticket, 3: Uso Interno, 4: Dañado
  id_ticket?: string;
  id_departament_consumable?: string;
  observations?: string;
  items: ConsumableItemDto[];
}

export interface ConsumableMovementResponse {
  message: string;
  code_movement_aplication: string;
  total_items_processed: number;
  records_affected: number;
}
// interfaces/consumable-movement.interfaces.ts

export interface ConsumableItemDto {
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
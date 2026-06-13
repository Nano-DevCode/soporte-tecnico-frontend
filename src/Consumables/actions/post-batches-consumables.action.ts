import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";
import type { BatchProductItem } from "./get-batches-consumables"; // Asegúrate de apuntar a tu archivo de lectura

// 1. Interfaz para el elemento individual de la bolsa de herramientas (Detalle)
export interface CreateBatchItemPayload {
  id_consumable: string;   // Debe ser un UUID v4 válido
  arrival_amount: number;  // Entero positivo (cantidad física recibida)
  cost_batch: number;      // Número decimal positivo (costo total del lote)
}

// 2. Interfaz del Payload Maestro-Detalle que espera el CreateBatchesproductDto
export interface CreateBatchProductPayload {
  num_requirement: string;            // Número de requisición único
  items: CreateBatchItemPayload[];   // Bolsa con mínimo 1 artículo
}

// 3. Interfaz de la respuesta exitosa del servidor tras el commit de la transacción
export interface CreateBatchProductResponse {
  message: string;
  total_processed: number;
  batches: BatchProductItem[]; // Lista de lotes creados con sus IDs y timestamps definitivos
}

export const createBatchesProductAction = async (payload: CreateBatchProductPayload): Promise<CreateBatchProductResponse> => {
  const url = '/batches-products';

  // Limpieza preventiva de strings antes de enviar los datos al backend
  const normalizedPayload: CreateBatchProductPayload = {
    num_requirement: payload.num_requirement.trim(),
    items: payload.items.map(item => ({
      id_consumable: item.id_consumable,
      arrival_amount: Math.floor(Number(item.arrival_amount)), // Aseguramos que sea entero
      cost_batch: Number(item.cost_batch),                     // Aseguramos formato flotante numérico
    }))
  };

  const response = await soporteTecnicoApi.post<CreateBatchProductResponse>(url, normalizedPayload);
  return response.data;
};
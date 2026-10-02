/* eslint-disable no-useless-catch */
import { soporteTecnicoApi } from "../../api/soporteTecnicoApi";
import type { BatchProductItem } from "./get-batches-consumables"; 

// 1. Interfaz para el elemento individual de la bolsa de herramientas (Detalle)
export interface CreateBatchItemPayload {
  id_consumable: string;   
  arrival_amount: number;  
  cost_batch: number;      
}

// 2. Interfaz del Payload Maestro-Detalle que espera el CreateBatchesproductDto
export interface CreateBatchProductPayload {
  num_requirement: string;            
  items: CreateBatchItemPayload[];   
}

// 3. Interfaz de la respuesta exitosa del servidor tras el commit de la transacción
export interface CreateBatchProductResponse {
  errors: string[];
  message: string;
  total_processed: number;
  batches: BatchProductItem[]; 
}

export const createBatchesProductAction = async (
  payload: CreateBatchProductPayload
): Promise<CreateBatchProductResponse> => {
  const url = '/batches-products';

  // Normalización de datos (Excelente práctica para evitar strings vacíos o flotantes raros)
  const normalizedPayload: CreateBatchProductPayload = {
    num_requirement: payload.num_requirement.trim(),
    items: payload.items.map(item => ({
      id_consumable: item.id_consumable,
      arrival_amount: Math.floor(Number(item.arrival_amount)),
      cost_batch: Number(item.cost_batch),
    }))
  };

  try {
    const response = await soporteTecnicoApi.post<CreateBatchProductResponse>(url, normalizedPayload);
    return response.data;
  } catch (error) {
    throw error;
  }
};
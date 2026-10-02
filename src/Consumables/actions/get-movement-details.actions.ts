import { soporteTecnicoApi } from "../../api/soporteTecnicoApi";
import type { MovementsConsumableItem } from "./get-movement-consumables.actions";

// Acción para recuperar todos los consumibles asociados a un mismo folio agrupador
export const getMovementsByFolioAction = async (codeMovementApplication: string): Promise<MovementsConsumableItem[]> => {
  try {
    const { data } = await soporteTecnicoApi.get<MovementsConsumableItem[]>(`/consumable-movements/summary/${encodeURIComponent(codeMovementApplication)}`);
    return data;
  } catch {
    return [];
  }
};
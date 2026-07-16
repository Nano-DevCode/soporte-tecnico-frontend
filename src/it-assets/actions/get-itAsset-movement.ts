import { soporteTecnicoApi, API_BASE_URL } from "@/api/soporteTecnicoApi";
import type { ItAssetsMovement } from '../interfaces/itAssetsMovementResponse';

export const getItAssetsMovementAction = async (id: string): Promise<ItAssetsMovement> => {
  const { data } = await soporteTecnicoApi.get<ItAssetsMovement>(`/it-assets-movements/${id}`);  
  
  if (data.itAsset?.imageUrl && !data.itAsset.imageUrl.startsWith('http')) {
    data.itAsset.imageUrl = `${API_BASE_URL}${data.itAsset.imageUrl}`;
  }

  return data;
}
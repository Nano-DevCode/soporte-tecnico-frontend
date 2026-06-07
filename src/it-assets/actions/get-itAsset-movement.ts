import { soporteTecnicoApi } from "@/api/soporteTecnicoApi"
import type { ItAssetsMovement } from '../interfaces/itAssetsMovementResponse';

export const getItAssetsMovementAction = async (id: string): Promise<ItAssetsMovement> => {
  // Corregimos la ruta apuntando a movements
  const { data } = await soporteTecnicoApi.get<ItAssetsMovement>(`/it-assets-movements/${id}`);  
  
  const baseUrl = import.meta.env.VITE_API_URL;
  
  if (data.itAsset?.imageUrl && !data.itAsset.imageUrl.startsWith('http')) {
    data.itAsset.imageUrl = `${baseUrl}${data.itAsset.imageUrl}`;
  }

  return data;
}
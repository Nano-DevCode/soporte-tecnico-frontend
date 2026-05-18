import { soporteTecnicoApi } from "@/api/soporteTecnicoApi"
import type { Tool } from "../interfaces/toolsResponse";

interface Options {
  id: string;
  description: string;
  modelId: string;
  typeId: string;
  image?: File; 
  idInternal: string;
}

export const updateToolsActions = async (options: Options): Promise<Tool> => {
  const { id, description, modelId, typeId, image, idInternal } = options;
  
  const formData = new FormData();
  formData.append('description', description);
  formData.append('modelId', modelId);
  formData.append('typeId', typeId);
  formData.append('idInternal', idInternal);
  
  if (image) {
    formData.append('image', image);
  }

  const { data } = await soporteTecnicoApi.patch<Tool>(`/tools/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return data;
}
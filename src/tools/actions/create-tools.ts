import { soporteTecnicoApi } from "@/api/soporteTecnicoApi"
import type { Tool } from "../interfaces/toolsResponse";

interface Options {
  description: string;
  modelId: string;
  typeId: string;
  idInternal?: string;
  image: File;
}

export const createToolsActions = async (options: Options): Promise<Tool> => {
  const { description, modelId, typeId, idInternal, image } = options;
  
  const formData = new FormData();
  
  // Agregamos solo lo que tu DTO de NestJS espera
  formData.append('description', description);
  formData.append('modelId', modelId);
  formData.append('typeId', typeId);
  
  if (idInternal) {
    formData.append('idInternal', idInternal);
  }

  // Agregamos la imagen
  formData.append('image', image);

  // Enviamos al backend
  const { data } = await soporteTecnicoApi.post<Tool>('/tools', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  
  return data;
}
import { soporteTecnicoApi } from "@/api/soporteTecnicoApi"
import type { Tool } from "../interfaces/toolsResponse";

interface Options {
  ids: string[];
}

export const getToolsByIdsAction = async(options: Options): Promise<Tool[]> => {
  const { ids } = options;

  if (!ids || ids.length === 0) {
    return [];
  }

  const { data } = await soporteTecnicoApi.post<Tool[]>('/tools/by-ids', { ids });  

  const BASE_URL = import.meta.env.VITE_API_URL;

  const toolsWithImages: Tool[] = data.map(tool => ({
    ...tool,
    imageUrl: tool.imageUrl 
      ? `${BASE_URL}${tool.imageUrl}` 
      : null
  }));

  return toolsWithImages;
}
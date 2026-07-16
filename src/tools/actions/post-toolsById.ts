import { soporteTecnicoApi, API_BASE_URL } from "@/api/soporteTecnicoApi"
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

  const toolsWithImages: Tool[] = data.map(tool => ({
    ...tool,
    imageUrl: tool.imageUrl 
      ? `${API_BASE_URL}${tool.imageUrl}` 
      : null
  }));

  return toolsWithImages;
}
import { soporteTecnicoApi, API_BASE_URL } from "@/api/soporteTecnicoApi";
import type { ToolsResponse } from "../interfaces/toolsResponse";

interface Options {
  haveInternalId?: string;
  limit?: number | string;
  offset?: number | string;
  status?: string;
  query?: string;
  brandId?: string;
  modelId?: string;
  typeId?: string;
}

export const getToolsActions = async(options: Options): Promise<ToolsResponse> => {
  const { limit = 10, offset = 0, status = undefined, query = undefined, modelId=undefined , typeId = undefined, brandId = undefined, haveInternalId = undefined} = options;
  
  const statusValue = status === 'true' ? true : status === 'false' ? false : undefined;
  const haveInternalIdValue = haveInternalId === 'true' ? true : haveInternalId === 'false' ? false : undefined;

  const { data } = await soporteTecnicoApi.get<ToolsResponse>('/tools', {
    params: {
      limit: isNaN(Number(limit)) ? 10 : Number(limit),
      offset: isNaN(Number(offset)) ? 0 : Number(offset),
      status: statusValue,
      query: query ? query.trim().replaceAll('+', ' ') : undefined,
      modelId: modelId,
      typeId: typeId,
      brandId: brandId,
      haveInternalId: haveInternalIdValue
    },
  });  

  const { tools, ...restOfData } = data;

  const toolsWithImages = tools.map(tool => ({
    ...tool,
    imageUrl: tool.imageUrl 
      ? `${API_BASE_URL}${tool.imageUrl}` 
      : null
  }));

  return {
    ...restOfData,
    tools: toolsWithImages
  };
}
import { soporteTecnicoApi, API_BASE_URL } from "@/api/soporteTecnicoApi";
import type { ItAssetsResponse } from "../interfaces/itAssetsResponse.interface";

interface Options {
  limit?: number | string;
  offset?: number | string;
  query?: string;
  brandId?: string;
  typeId?: string;
  modelId?: string;
  status?: boolean;
}

export const getItAssetsAction = async (
  options: Options
): Promise<ItAssetsResponse> => {

  const {
    limit = 10,
    offset = 0,
    query = undefined,
    brandId = undefined,
    typeId = undefined,
    modelId = undefined,
    status = undefined,
  } = options;

  const { data } = await soporteTecnicoApi.get<ItAssetsResponse>(
    "/it-assets",
    {
      params: {
        limit: isNaN(Number(limit))
          ? 10
          : Number(limit),

        offset: isNaN(Number(offset))
          ? 0
          : Number(offset),

        query: query
          ? query.trim().replaceAll("+", " ")
          : undefined,
        brandId: brandId ?? undefined,
        typeId: typeId ?? undefined,
        modelId: modelId ?? undefined,
        status: status ?? undefined,
      },
    }
  );

  const { itAssets, ...restOfData } = data;

  const itAssetsWithImages = itAssets.map((itAsset) => ({
    ...itAsset,
    imageUrl: itAsset.imageUrl
      ? `${API_BASE_URL}${itAsset.imageUrl}`
      : null,
  }));

  return {
    ...restOfData,
    itAssets: itAssetsWithImages,
  };
};
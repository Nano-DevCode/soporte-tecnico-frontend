import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";
import type { ItAssetsResponse } from "../interfaces/itAssetsResponse.interface";

interface Options {
  limit?: number | string;
  offset?: number | string;
  query?: string;
}

export const getItAssetsAction = async (
  options: Options
): Promise<ItAssetsResponse> => {

  const {
    limit = 10,
    offset = 0,
    query = undefined,
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
      },
    }
  );

  const BASE_URL = import.meta.env.VITE_API_URL;

  const { itAssets, ...restOfData } = data;

  const itAssetsWithImages = itAssets.map((itAsset) => ({
    ...itAsset,

    imageUrl: itAsset.imageUrl
      ? `${BASE_URL}${itAsset.imageUrl}`
      : null,
  }));

  return {
    ...restOfData,
    itAssets: itAssetsWithImages,
  };
};
import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";
// import { t } from "i18next";
export interface Brand {
  id: string;
  name: string;
  created_at?: string;
  updated_at?: string;
}
export interface BrandsResponse {
  brands: Brand[];
  meta: {
    total: number;
    page: number;
    lastPage: number;
  };
}
export interface Options {
  limit?: number | string;
  offset?: number | string;
  query?: string;

}
export const getBrandsAction = async (options: Options = {}): Promise<BrandsResponse> => {
  const { limit = 10, offset = 0, query = undefined } = options;
  try {
    const { data } = await soporteTecnicoApi.get<BrandsResponse>('/brands', {
      params: {
        limit: isNaN(Number(limit)) ? 10 : Number(limit),
        offset: isNaN(Number(offset)) ? 0 : Number(offset),
        query: query?.replaceAll('+', ' '),
      },
    });
    return data;
  } catch (error) {
    // console.error(t("api_brands_fetch_error"), error);
    void error;
    return {
      brands: [],
      meta: {
        total: 0,
        page: 1,
        lastPage: 1
      }
    };
  }
};

export const getBrandByIdAction = async (idOrObject: string | { id: string }) => {
    const id = typeof idOrObject === 'object' ? idOrObject.id : idOrObject;
    if (!id) return null;
    const { data } = await soporteTecnicoApi.get<Brand>(`/brands/${id}`);
    return data;
};

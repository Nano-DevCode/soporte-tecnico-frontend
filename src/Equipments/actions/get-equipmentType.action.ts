import { soporteTecnicoApi } from "../../api/soporteTecnicoApi";
// import { t } from "i18next";

// --- INTERFACES ---
export interface EquipmentType {
  id: string;
  name: string;
  created_at?: string;
  updated_at?: string;
}

export interface EquipmentTypesResponse {
  equipmentTypes: EquipmentType[];
  meta: {
    total: number;
    page: number;
    lastPage: number;
  };
}

interface FilterOptions {
  limit?: number | string;
  offset?: number | string;
  query?: string;
}
export const getEquipmentTypesAction = async (options: FilterOptions): Promise<EquipmentTypesResponse> => {
  const { limit = 10, offset = 0, query = undefined } = options;

  try {
    const { data } = await soporteTecnicoApi.get<EquipmentTypesResponse>('/equipmenttypes', {
      params: {
        limit: isNaN(Number(limit)) ? 10 : Number(limit),
        offset: isNaN(Number(offset)) ? 0 : Number(offset),
        query: query?.replaceAll('+', ' '),
      },
    });

    return data;
  } catch (error) {
    // console.error(t("api_equipment_types_fetch_error"), error);
    void error;
    
    return {
      equipmentTypes: [],
      meta: {
        total: 0,
        page: 1,
        lastPage: 1,
      },
    };
  }
};

export const getEquipmentTypeByIdAction = async (
  idOrObject: string | { id: string }
): Promise<EquipmentType | null> => {
  const id = typeof idOrObject === 'object' ? idOrObject?.id : idOrObject;

  if (!id) return null;

  try {
    const { data } = await soporteTecnicoApi.get<EquipmentType>(`/equipmenttypes/${id}`);
    return data;
  } catch (error) {
    // console.error(`${t("api_equipment_type_by_id_error")} ${id}:`, error);
    void error;
    return null;
  }
};
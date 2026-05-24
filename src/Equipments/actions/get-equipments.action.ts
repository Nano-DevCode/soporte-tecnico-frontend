import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";
import { getEquipmentTypesAction, type EquipmentType } from "./get-equipmentType.action";
import { t } from "i18next";

export const getEquipmentsAction = async (options: {
  category: string;
  search?: string;
  status?: string;
  limit: number;
  offset: number;
}) => {
  const { category, limit, offset, search, status } = options;

  try {
    let url = '/equipments';

    if (category !== 'all') {
      const responseTypes = await getEquipmentTypesAction({ limit: 100, offset: 0 });
      const types = responseTypes?.equipmentTypes || [];

      const currentType = types.find((t: EquipmentType) =>
        t.name.toLowerCase() === category.toLowerCase()
      );

      if (!currentType) return { data: [], meta: { total: 0, lastPage: 1, page: 1 } };
      
      url = `/equipments/type/${category.toLowerCase()}/${currentType.id}`; 
    }

    const isStatusValid = status === 'true' || status === 'false';

    const response = await soporteTecnicoApi.get(url, {
      params: { 
        query: search && search.trim() !== '' ? search.trim() : undefined,
        category: category !== 'all' ? category : undefined,
        status: isStatusValid ? status : undefined,
        limit,
        offset,
      }
    });
    const responseData = response.data?.data || [];
    const responseMeta = response.data?.meta || { total: 0, page: 1, lastPage: 1 };

    return {
      data: responseData,
      meta: responseMeta
    };

  } catch (error) {
    console.error(t("api_equipments_fetch_error"), error);
    return { data: [], meta: { total: 0, lastPage: 1, page: 1 } };
  }
};
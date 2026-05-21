import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";
import { getEquipmentTypesAction, type EquipmentType } from "./get-equipmentType.action";

export const getEquipmentsAction = async (options: {
  category: string,
  search?: string,
  status?: string,
  limit: number,
  offset: number,
}) => {
  const { category, limit, offset, search, status } = options;

  try {
    let url = '/equipments';

    // Lógica de categorías existente
    if (category !== 'all') {
      const types = await getEquipmentTypesAction();
      const currentType = types.find((t: EquipmentType) =>
        t.name.toLowerCase() === category.toLowerCase()
      );

      if (!currentType) return { data: [], meta: { total: 0, lastPage: 1 } };
      url = `/equipments/type/${category}/${currentType.id}`;
    }

    // --- AJUSTE EN PARÁMETROS ---
    // Forzamos a que solo viaje al backend si es explícitamente "true" o "false" en string
    const isStatusValid = status === 'true' || status === 'false';

    const { data } = await soporteTecnicoApi.get(url, {
      params: { 
        query: search && search.trim() !== '' ? search.trim() : undefined,
        category: category !== 'all' ? category : undefined,
        status: isStatusValid ? status : undefined,
      }
    });

    // Validamos la estructura del arreglo que regresa el backend mapeado
    const rawItems = Array.isArray(data) ? data : (data.items || []);
    
    // Calculamos la paginación en el frontend basándonos en los datos ya filtrados por el QueryBuilder del Backend
    const totalItems = rawItems.length;
    const paginatedData = rawItems.slice(offset, offset + limit);
    const lastPage = Math.ceil(totalItems / limit);

    return {
      data: paginatedData,
      meta: {
        total: totalItems,
        page: Math.floor(offset / limit) + 1,
        lastPage: lastPage || 1
      }
    };

  } catch (error) {
    console.error("Error en getEquipmentsAction:", error);
    return { data: [], meta: { total: 0, lastPage: 1 } };
  }
};

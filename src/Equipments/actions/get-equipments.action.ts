import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";
import { getEquipmentTypesAction } from "./get-equipmentType.action";

export const getEquipmentsAction = async (options: {
  category: string,
  limit: number,
  offset: number,
  search?: string
}) => {
  const { category, limit, offset, search } = options;

  try {
    let url = '/equipments';

    // Lógica de categorías
    if (category !== 'all') {
      const types = await getEquipmentTypesAction();
      const currentType = types.find((t: any) =>
        t.name.toLowerCase() === category.toLowerCase()
      );

      if (!currentType) return { data: [], meta: { total: 0, lastPage: 1 } };
      url = `/equipments/type/${category}/${currentType.id}`;
    }

    const { data } = await soporteTecnicoApi.get(url, {
      params: { query: search }
    });

    // Validamos que sea un arreglo para poder hacer el .slice()
    const rawItems = Array.isArray(data) ? data : (data.items || []);

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




// import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";
// import { getEquipmentTypesAction } from "./get-equipmentType.action";


// export const getEquipmentsAction = async (options: { category: string, limit: number, offset: number, search?: string }) => {
//   const { category, limit, offset, search } = options;

//   try {
//     let url = '/equipments';
//     if (category !== 'all') {
//       const types = await getEquipmentTypesAction();
//       const currentType = types.find((t: any) => t.name.toLowerCase() === category.toLowerCase());
//       if (!currentType) return { data: [], meta: { total: 0, lastPage: 1 } };
//       url = `/equipments/type/${category}/${currentType.id}`;
//     }

//     // Mantenemos la consulta original intacta
//     const { data } = await soporteTecnicoApi.get(url, {
//       params: { query: search }
//     });

//     if (Array.isArray(data)) {
//       // 1. Mantenemos el total real (ej. 21)
//       const totalItems = data.length;

//       // 2. RECORTAMOS el arreglo manualmente según el límite y offset
//       // Si el límite es 5 y estás en la pág 1, toma del 0 al 5.
//       const paginatedData = data.slice(offset, offset + limit);

//       // 3. Calculamos las páginas totales dinámicamente (21 / 5 = 5 páginas)
//       const lastPage = Math.ceil(totalItems / limit);

//       return {
//         data: paginatedData, // El Hook solo recibirá los 5 registros para la tabla
//         meta: {
//           total: totalItems,
//           page: Math.floor(offset / limit) + 1,
//           lastPage: lastPage || 1
//         }
//       };
//     }

//     return data;
//   } catch (error) {
//     return { data: [], meta: { total: 0, lastPage: 1 } };
//   }
// };

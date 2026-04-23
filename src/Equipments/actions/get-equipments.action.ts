// import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";
// import type { DepartmentResponse } from "../interfaces/equipment.interface";

// interface Options {
//   limit?: number | string;
//   offset?: number | string;
//   status?: string;
//   query?: string;
// }

// export const getDepartmentsActions = async(options: Options):Promise<DepartmentResponse> => {
//   const { limit = 10, offset = 0, status = undefined, query = undefined } = options;
//   const statusValue = status === 'true' 
//     ? true 
//     : status === 'false' 
//       ? false 
//       : undefined;
//   const { data } = await soporteTecnicoApi.get<DepartmentResponse>('/departments/filter',
//     {
//       params: {
//         limit: isNaN(Number(limit)) ? 10 : Number(limit),
//         offset: isNaN(Number(offset)) ? 0 : Number(offset),
//         status: statusValue,
//         query: query ? query.trim().replaceAll('+', ' ') : undefined,
//       },
//     }
//   );  
//   return data;
// }

// interface Options {
//   category: EquipmentCategory | 'all';
//   limit?: number;
//   offset?: number;
// }
// get-equipments.action.ts
import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";
import { getEquipmentTypesAction } from "./get-equipmentType.action";

export const getEquipmentsAction = async (options: { category: string, limit: number, offset: number, search?: string }) => {
  const { category, limit, offset, search } = options;

  try {
    let url = '/equipments';
    if (category !== 'all') {
      const types = await getEquipmentTypesAction();
      const currentType = types.find((t: any) => t.name.toLowerCase() === category.toLowerCase());
      if (!currentType) return { data: [], meta: { total: 0, lastPage: 1 } };
      url = `/equipments/type/${category}/${currentType.id}`;
    }

    // Mantenemos la consulta original intacta
    const { data } = await soporteTecnicoApi.get(url, {
      params: { query: search } 
    });

    if (Array.isArray(data)) {
      // 1. Mantenemos el total real (ej. 21)
      const totalItems = data.length;

      // 2. RECORTAMOS el arreglo manualmente según el límite y offset
      // Si el límite es 5 y estás en la pág 1, toma del 0 al 5.
      const paginatedData = data.slice(offset, offset + limit);

      // 3. Calculamos las páginas totales dinámicamente (21 / 5 = 5 páginas)
      const lastPage = Math.ceil(totalItems / limit);

      return {
        data: paginatedData, // El Hook solo recibirá los 5 registros para la tabla
        meta: {
          total: totalItems,
          page: Math.floor(offset / limit) + 1,
          lastPage: lastPage || 1
        }
      };
    }

    return data;
  } catch (error) {
    return { data: [], meta: { total: 0, lastPage: 1 } };
  }
};


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

//     const { data } = await soporteTecnicoApi.get(url, {
//       params: { limit, offset, query: search }
//     });

//     // NORMALIZACIÓN CRÍTICA:
//     // Tus capturas muestran que 'data' es un Array de 21 items
//     if (Array.isArray(data)) {
//       return {
//         data: data,
//         meta: {
//           total: data.length,
//           lastPage: Math.ceil(data.length / limit) || 1
//         }
//       };
//     }

//     return data; // Si el back llegara a mandar el objeto {data, meta}
//   } catch (error) {
//     return { data: [], meta: { total: 0, lastPage: 1 } };
//   }
// };
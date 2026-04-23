


import { useSearchParams } from "react-router";
import { getEquipmentsAction } from '../actions/get-equipments.action';
import type{ EquipmentCategory } from '../interfaces/equipment.interface';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useEquipments = () => {
  const [searchParams] = useSearchParams();
  
  // Estos valores vienen de la URL y activan el re-renderizado
  const limit = Number(searchParams.get('limit')) || 10;
  const page = Number(searchParams.get('page')) || 1;
  const offset = (page - 1) * limit;
  const category = (searchParams.get('category') || 'all') as EquipmentCategory | 'all';
  const query = searchParams.get("search")?.trim() || undefined; 

  const equipmentsQuery = useQuery({
    queryKey: ['equipments', { category, limit, offset, query }],
    queryFn: () => getEquipmentsAction({ category, limit, offset, search: query }),
    staleTime: 1000 * 60 * 5,
    select: (response) => ({
      equipments: response.data, // Aquí vendrán solo 5 si el límite es 5
      meta: response.meta,       // Aquí vendrá el lastPage calculado
    }),
  });

  return {
    equipments: equipmentsQuery.data?.equipments ?? [],
    meta: equipmentsQuery.data?.meta,
    isLoading: equipmentsQuery.isLoading,
  };
};


// export const useEquipments = () => {
//   const [searchParams] = useSearchParams();
//   const queryClient = useQueryClient();

//   const limit = Number(searchParams.get('limit')) || 10;
//   const page = Number(searchParams.get('page')) || 1;
//   const offset = (page - 1) * limit;
//   const category = (searchParams.get('category') || 'all') as EquipmentCategory | 'all';
//   const query = searchParams.get("search")?.trim() || undefined; 

//   const equipmentsQuery = useQuery({
//     queryKey: ['equipments', { category, limit, offset, query }],
//     queryFn: () => getEquipmentsAction({ category, limit, offset, search: query }),
//     staleTime: 1000 * 60 * 5,
//     // Ahora 'response' siempre tendrá data y meta gracias al paso anterior
//     select: (response) => ({
//       equipments: response.data,
//       meta: response.meta,
//     }),
//   });

//   return {
//     equipments: equipmentsQuery.data?.equipments ?? [],
//     meta: equipmentsQuery.data?.meta,
//     isLoading: equipmentsQuery.isLoading,
//   };
// };
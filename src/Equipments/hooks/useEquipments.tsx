import { useSearchParams } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getEquipmentsAction } from '../actions/get-equipments.action';
// Importa tus nuevas acciones
// import { createEquipmentAction } from '../actions/create-equipment.action';
// import { updateEquipmentAction } from '../actions/update-equipment.action';
import type { EquipmentCategory } from '../interfaces/equipment.interface';

export const useEquipments = (equipmentId?: string) => {
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();
  
  // --- LÓGICA DE LISTADO (GET ALL) ---
  const limit = Number(searchParams.get('limit')) || 10;
  const page = Number(searchParams.get('page')) || 1;
  const offset = (page - 1) * limit;
  const category = (searchParams.get('category') || 'all') as EquipmentCategory | 'all';
  const query = searchParams.get("search")?.trim() || undefined;
  const status = searchParams.get("status") || 'all';

  const equipmentsQuery = useQuery({
    queryKey: ['equipments', { category,  query, status, limit, offset }],
    queryFn: () => getEquipmentsAction({ category, search: query, status: status !== 'all' ? status : undefined, limit, offset, }),
    staleTime: 1000 * 60 * 5,
    select: (response) => ({
      equipments: response.data,
      meta: response.meta,
    }),
  });

  // --- LÓGICA DE EQUIPO ÚNICO (Para Edición) ---
  const singleEquipmentQuery = useQuery({
    queryKey: ['equipment', equipmentId],
    queryFn: () => {}, // Sustituir por getEquipmentByIdAction(equipmentId!)
    enabled: !!equipmentId, // Solo se ejecuta si hay un ID
  });

  // --- MUTACIONES (POST / PATCH) ---
  
  const createMutation = useMutation({
    mutationFn: () => Promise.resolve(), // Sustituir por createEquipmentAction(data)
    onSuccess: () => {
      // Refrescar la lista de equipos globalmente
      queryClient.invalidateQueries({ queryKey: ['equipments'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (params: { id: string; data: unknown }) => Promise.resolve(params), // Sustituir por updateEquipmentAction(id, data)
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['equipments'] });
      queryClient.invalidateQueries({ queryKey: ['equipment', variables.id] });
    },
  });

  return {
    // Datos de listado
    equipments: equipmentsQuery.data?.equipments ?? [],
    meta: equipmentsQuery.data?.meta,
    isLoading: equipmentsQuery.isLoading,

    // Datos de edición
    equipment: singleEquipmentQuery.data,
    isFetchingSingle: singleEquipmentQuery.isLoading,

    // Acciones de formulario
    createEquipmentAsync: createMutation.mutateAsync,
    updateEquipmentAsync: updateMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
  };
};

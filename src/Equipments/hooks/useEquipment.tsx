import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router";
import { getEquipmentByIdAction } from "../actions/get-equipment.actions";

export const useEquipment = () => {
  // 1. Obtenemos el ID directamente de la URL
  const { id } = useParams<{ id: string }>();

  const equipmentQuery = useQuery({
    // 2. IMPORTANTE: El ID debe estar en la queryKey para que 
    // React Query sepa que si el ID cambia, debe disparar la petición.
    queryKey: ['equipment', id],
    
    // 3. Pasamos el ID a la función del action
    queryFn: () => getEquipmentByIdAction(id!),
    
    // 4. Solo ejecutar si el ID existe en la URL
    enabled: !!id,
    
    // Opcional: forzar que los datos se consideren "viejos" para 
    // que siempre intente traer los nuevos al entrar
    staleTime: 0, 
  });

  return {
    equipment: equipmentQuery.data,
    isLoading: equipmentQuery.isLoading,
    isError: equipmentQuery.isError,
    error: equipmentQuery.error,
  };
};
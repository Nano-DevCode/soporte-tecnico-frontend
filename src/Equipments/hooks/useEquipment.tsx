import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { getEquipmentByIdAction } from "../actions/get-equipment.actions";

export const useEquipment = () => {
  const { id } = useParams<{ id: string }>();

  const isEditing = !!id && id !== "new";

  const equipmentQuery = useQuery({
    queryKey: ["equipment", id],
    queryFn: () => getEquipmentByIdAction(id!),
    enabled: isEditing,
    refetchOnWindowFocus: false, 
    
    staleTime: 0,
    gcTime: 1000 * 60 * 10, // 10 minutos
  });

  return {
    equipment: equipmentQuery.data,
    isLoading: equipmentQuery.isLoading,
    isError: equipmentQuery.isError,
    error: equipmentQuery.error,
    isEditing, 
  };
};
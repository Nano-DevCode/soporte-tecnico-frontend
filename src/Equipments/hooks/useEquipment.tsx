import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { getEquipmentByIdAction } from "../actions/get-equipment.actions";

export const useEquipment = () => {
  const { id } = useParams<{ id: string }>();

  // Verificamos que sea un UUID o ID válido y no la palabra "new"
  const isEditing = !!id && id !== "new";

  const equipmentQuery = useQuery({
    queryKey: ["equipment", id],
    queryFn: () => getEquipmentByIdAction(id!),
    
    // Ajuste: Solo ejecuta si hay ID Y no es la palabra "new"
    enabled: isEditing,
    
    // Evita que al re-enfocar la ventana del navegador se dispare la petición
    refetchOnWindowFocus: false, 
    
    // Tiempo en que los datos se mantienen en memoria antes de ser eliminados
    gcTime: 1000 * 60 * 10, // 10 minutos
  });

  return {
    equipment: equipmentQuery.data,
    isLoading: equipmentQuery.isLoading,
    isError: equipmentQuery.isError,
    error: equipmentQuery.error,
    // Devolvemos este flag para que el FormContainer sepa si está editando o creando
    isEditing, 
  };
};
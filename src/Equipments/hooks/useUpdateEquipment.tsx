import { useMutation, useQueryClient } from "@tanstack/react-query";
import { equipmentUpdateAction, type UpdateEquipmentDTO } from "../actions/update-equipment.action";

export const useUpdateEquipment = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    // Utilizamos la acción y el DTO de equipos que configuramos con los campos del backend
    mutationFn: ({ id, data }: { id: string; data: UpdateEquipmentDTO }) => 
      equipmentUpdateAction(id, data),
    
    onSuccess: (_, variables) => {
      // Invalidamos la lista general de equipos
      queryClient.invalidateQueries({ queryKey: ['equipments'] });
      
      // Invalidamos la información específica del equipo actualizado (para la página de detalles/edición)
      queryClient.invalidateQueries({ queryKey: ['equipment', variables.id] });
    },
    onError: (error: any) => {
      console.error("Error al actualizar equipo:", error.message);
    }
  });

  return {
    // Nombres ajustados al dominio de inventario
    updateEquipment: mutation.mutateAsync,
    isUpdating: mutation.isPending,
    error: mutation.error,
  };
};
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEquipmentAction, type CreateEquipmentDTO } from "../actions/post-equipment.action";

export const useCreateEquipment = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    // Usamos la acción y el DTO específicos para Equipos
    mutationFn: (newEquipment: CreateEquipmentDTO) => createEquipmentAction(newEquipment),
    
    onSuccess: () => {
      // Al crear un equipo, invalidamos la caché de la lista de equipos 
      // para que se refresque automáticamente
      queryClient.invalidateQueries({ queryKey: ['equipments'] });
    },
    onError: (error: any) => {
      // Opcional: Podrías integrar un Toast aquí para mostrar el mensaje de error
      console.error("Error al registrar equipo:", error.message);
    }
  });

  return {
    // Renombrado para mayor claridad en el módulo de inventario
    createEquipment: mutation.mutateAsync,
    isCreating: mutation.isPending,
    error: mutation.error,
  };
};
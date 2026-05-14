import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateEquipmentAction, type EquipmentPayload } from "../actions/post-equipment.action";
import { toast } from "sonner";

export const useUpdateEquipment = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    // Ajustamos los nombres de los parámetros para que coincidan con 'updateEquipmentAction'
    mutationFn: ({ id, payload }: { id: string; payload: Partial<EquipmentPayload> }) =>
      updateEquipmentAction(id, payload),

    onSuccess: (data, variables) => {
      // 1. Notificación al usuario
      toast.success("Equipo actualizado correctamente");

      // 2. Invalida la lista global para que se reflejen los cambios en las tablas
      queryClient.invalidateQueries({
        queryKey: ['equipments']
      });

      // 3. Invalida el equipo específico. 
      // Esto es vital para que la página 'UpdateEquipment' vea los datos frescos
      queryClient.invalidateQueries({
        queryKey: ['equipment', variables.id]
      });
    },

    onError: (error: Error) => {
      // Capturamos el mensaje que viene del backend a través del Action
      // Si el backend envía { message: "..." }, lo mostramos aquí.
      const errorMessage = error?.message || "Ocurrió un error al actualizar el equipo";
      toast.error(errorMessage);
    }
  });

  return {
    // Exponemos mutateAsync con un nombre claro
    updateEquipmentAsync: mutation.mutateAsync,
    isUpdating: mutation.isPending,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
  };
};
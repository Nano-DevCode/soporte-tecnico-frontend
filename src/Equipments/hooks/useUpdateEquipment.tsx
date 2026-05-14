import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
// Importamos el action con el nombre correcto que definimos para la actualización
import { updateEquipmentAction, type EquipmentPayload } from "../actions/post-equipment.action";

export const useUpdateEquipment = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    /**
     * mutationFn: Recibe el ID del equipo y el objeto 'data' que viene del Form.
     * Recordatorio: 'data' contiene objetos del CatalogSelector, el Action los limpiará.
     */
    mutationFn: ({ id, data }: { id: string; data: Partial<EquipmentPayload>}) =>
      updateEquipmentAction(id, data),

    onSuccess: (_, variables) => {
      // 1. Feedback positivo
      toast.success("Equipo actualizado correctamente");

      // 2. Refrescar la lista general (Tablas, Inventario)
      queryClient.invalidateQueries({ 
        queryKey: ['equipments'] 
      });

      // 3. Refrescar el equipo específico (Vital para la página de edición)
      queryClient.invalidateQueries({ 
        queryKey: ['equipment', variables.id] 
      });
    },

    onError: (error: Error) => {
      // El action ya lanza el mensaje de error del backend, aquí solo lo mostramos
      toast.error(error.message || "Ocurrió un error al actualizar el equipo");
    }
  });

  return {
    // Exponemos la función asíncrona para usarla con try/catch en la página
    updateEquipmentAsync: mutation.mutateAsync,
    // Exponemos el estado de carga para bloquear botones
    isUpdating: mutation.isPending,
  };
};


// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { updateEquipmentAction, type Equ } from "../actions/post-equipment.action";
// import { toast } from "sonner";


// export const useUpdateEquipment = () => {
//   const queryClient = useQueryClient();

//   const mutation = useMutation({
//     // Usamos 'data' para que coincida con la llamada en la página
//     mutationFn: ({ id, data }: { id: string; data: Partial<EquipmentPayload> }) =>
//       updateEquipmentAction(id, data), // Asegúrate de que el nombre coincida con el export del Action

//     onSuccess: (_, variables) => {
//       toast.success("Equipo actualizado correctamente");

//       // Invalida la lista completa
//       queryClient.invalidateQueries({ queryKey: ['equipments'] });

//       // Invalida el equipo individual para que los detalles se refresquen
//       queryClient.invalidateQueries({ queryKey: ['equipment', variables.id] });
//     },

//     onError: (error: Error) => {
//       toast.error(error.message || "Error al actualizar");
//     }
//   });

//   return {
//     updateEquipmentAsync: mutation.mutateAsync,
//     isUpdating: mutation.isPending,
//   };
// };

// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { updateEquipmentAction, type EquipmentPayload } from "../actions/post-equipment.action";
// import { toast } from "sonner";

// export const useUpdateEquipment = () => {
//   const queryClient = useQueryClient();

//   const mutation = useMutation({
//     // Ajustamos los nombres de los parámetros para que coincidan con 'updateEquipmentAction'
//     mutationFn: ({ id, payload }: { id: string; payload: Partial<EquipmentPayload> }) =>
//       updateEquipmentAction(id, payload),

//     onSuccess: (data, variables) => {
//       // 1. Notificación al usuario
//       toast.success("Equipo actualizado correctamente");

//       // 2. Invalida la lista global para que se reflejen los cambios en las tablas
//       queryClient.invalidateQueries({
//         queryKey: ['equipments']
//       });

//       // 3. Invalida el equipo específico.
//       // Esto es vital para que la página 'UpdateEquipment' vea los datos frescos
//       queryClient.invalidateQueries({
//         queryKey: ['equipment', variables.id]
//       });
//     },

//     onError: (error: Error) => {
//       // Capturamos el mensaje que viene del backend a través del Action
//       // Si el backend envía { message: "..." }, lo mostramos aquí.
//       const errorMessage = error?.message || "Ocurrió un error al actualizar el equipo";
//       toast.error(errorMessage);
//     }
//   });

//   return {
//     // Exponemos mutateAsync con un nombre claro
//     updateEquipmentAsync: mutation.mutateAsync,
//     isUpdating: mutation.isPending,
//     isSuccess: mutation.isSuccess,
//     error: mutation.error,
//   };
// };
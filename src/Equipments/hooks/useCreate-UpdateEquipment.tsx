/* eslint-disable @typescript-eslint/no-explicit-any */


import { toast } from "sonner";
import { createEquipmentAction, updateEquipmentAction, type EquipmentPayload } from "../actions/post-equipment.action";
import { useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * Hook para la gestión de equipos.
 * Se han eliminado las funciones de normalización internas ya que el Formulario
 * ahora se encarga de enviar los IDs planos.
 */
export const useEquipments = () => {
    const queryClient = useQueryClient();

    // Mutación para Crear Equipo
    const createEquipmentMutation = useMutation({
        // El payload ya viene limpio desde EquipmentForm (onFormSubmit)
        mutationFn: (payload: EquipmentPayload) => createEquipmentAction(payload),
        onSuccess: () => {
            // Refresca la lista de equipos en la UI
            queryClient.invalidateQueries({ queryKey: ["equipments"] });
            toast.success("Equipo registrado con éxito");
        },
        onError: (error: any) => {
            const message = error?.response?.data?.message || error?.message || "Error al registrar el equipo";
            toast.error(message);
        }
    });

    // Mutación para Actualizar Equipo
    const updateEquipmentMutation = useMutation({
        // Recibe el ID y el payload ya procesado
        mutationFn: ({ id, payload }: { id: string; payload: EquipmentPayload }) =>
            updateEquipmentAction(id, payload),
        onSuccess: (data) => {
            // Invalidamos la lista general para ver los cambios
            queryClient.invalidateQueries({ queryKey: ["equipments"] });
            
            // Invalidamos la query del equipo específico para actualizar su detalle
            if (data?.id) {
                queryClient.invalidateQueries({ queryKey: ["equipment", data.id] });
            }

            toast.success("Información actualizada");
        },
        onError: (error: any) => {
            const message = error?.response?.data?.message || error?.message || "Error al actualizar el equipo";
            toast.error(message);
        }
    });

    return {
        // Métodos asíncronos para usar con await en el componente
        createEquipmentAsync: createEquipmentMutation.mutateAsync,
        updateEquipmentAsync: updateEquipmentMutation.mutateAsync,
        
        // Estados de carga para deshabilitar botones
        isCreating: createEquipmentMutation.isPending,
        isUpdating: updateEquipmentMutation.isPending,
    };
};
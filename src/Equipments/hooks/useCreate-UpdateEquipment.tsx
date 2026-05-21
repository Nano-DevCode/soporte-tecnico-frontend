import { toast } from "sonner";
import { createEquipmentAction, updateEquipmentAction, type EquipmentPayload } from "../actions/post-equipment.action";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";

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
        onError: (error: unknown) => {
            let message = "Error al Crear el equipo";
            if (isAxiosError(error)) {
                message = error.response?.data?.message || error.message;
            } else if (error instanceof Error) message = error.message; 
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
        onError: (error: unknown) => {
            let message = "Error al actualizar el equipo";
            if (isAxiosError(error)) {
                message = error.response?.data?.message || error.message;
            } else if (error instanceof Error) message = error.message; 
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
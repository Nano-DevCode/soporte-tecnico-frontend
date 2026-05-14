import { toast } from "sonner";
import { createEquipmentAction, updateEquipmentAction, type EquipmentPayload } from "../actions/post-equipment.action";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useEquipments = () => {
    const queryClient = useQueryClient();

    const createEquipmentMutation = useMutation({
        mutationFn: createEquipmentAction,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["equipments"] });
            toast.success("Equipo registrado con éxito");
        },
        onError: (error: Error) => { // Cambiado de Error a any
            // NestJS suele devolver el error en error.message o error.response.data.message
            const message = error?.message || "Error al registrar el equipo";
            toast.error(message);
        }
    });

    const updateEquipmentMutation = useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: Partial<EquipmentPayload> }) => 
            updateEquipmentAction(id, payload),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["equipments"] });
            queryClient.invalidateQueries({ queryKey: ["equipment", data.id] });
            toast.success("Información actualizada");
        },
        onError: (error: Error) => { // Cambiado de Error a any
            const message = error?.message || "Error al actualizar el equipo";
            toast.error(message);
        }
    });

    return {
        createEquipmentAsync: createEquipmentMutation.mutateAsync,
        isCreating: createEquipmentMutation.isPending,
        updateEquipmentAsync: updateEquipmentMutation.mutateAsync,
        isUpdating: updateEquipmentMutation.isPending,
    };
};
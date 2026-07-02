import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEquipmentAction, updateEquipmentAction, type EquipmentPayload } from "../actions/post-equipment.action";

export const useEquipments = () => {
    const queryClient = useQueryClient();

    // --- Mutación para Crear Equipo ---
    const createEquipmentMutation = useMutation({
        mutationFn: (payload: EquipmentPayload) => createEquipmentAction(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["equipments"] });
        },
    });

    const updateEquipmentMutation = useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: EquipmentPayload }) =>
            updateEquipmentAction(id, payload),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["equipments"] });
            if (data?.id) {
                queryClient.invalidateQueries({ queryKey: ["equipment", data.id] });
            }
        },
    });

    return {
        // Exponemos las funciones asíncronas listas para manejarse con sileo.promise en tus componentes
        createEquipmentAsync: createEquipmentMutation.mutateAsync,
        updateEquipmentAsync: updateEquipmentMutation.mutateAsync,

        isCreating: createEquipmentMutation.isPending,
        isUpdating: updateEquipmentMutation.isPending,
    };
};
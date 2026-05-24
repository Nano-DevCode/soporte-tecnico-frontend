import { toast } from "sonner";
import { createEquipmentAction, updateEquipmentAction, type EquipmentPayload } from "../actions/post-equipment.action";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { t } from "i18next";

export const useEquipments = () => {
    const queryClient = useQueryClient();

    // Mutación para Crear Equipo
    const createEquipmentMutation = useMutation({
        mutationFn: (payload: EquipmentPayload) => createEquipmentAction(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["equipments"] });
            toast.success(t("eq_hook_create_success"));
        },
        onError: (error: unknown) => {
            let message = t("eq_hook_create_error_default");
            if (isAxiosError(error)) {
                message = error.response?.data?.message || error.message;
            } else if (error instanceof Error) message = error.message; 
            toast.error(message);
        }
    });

    // Mutación para Actualizar Equipo
    const updateEquipmentMutation = useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: EquipmentPayload }) =>
            updateEquipmentAction(id, payload),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["equipments"] });
            if (data?.id) {
                queryClient.invalidateQueries({ queryKey: ["equipment", data.id] });
            }
            toast.success(t("eq_hook_update_success"));
        },
        onError: (error: unknown) => {
            let message = t("eq_hook_update_error_default");
            if (isAxiosError(error)) {
                message = error.response?.data?.message || error.message;
            } else if (error instanceof Error) message = error.message; 
            toast.error(message);
        }
    });

    return {
        createEquipmentAsync: createEquipmentMutation.mutateAsync,
        updateEquipmentAsync: updateEquipmentMutation.mutateAsync,

        isCreating: createEquipmentMutation.isPending,
        isUpdating: updateEquipmentMutation.isPending,
    };
};
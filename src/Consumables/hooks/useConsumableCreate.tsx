import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { isAxiosError } from "axios";
import { t } from "i18next";
import { toast } from "sonner";

import { 
    createConsumableAction, 
    updateConsumableAction, 
} from "../actions/post-update-consumables.actions";
import { getConsumableByIdAction } from "../actions/get-consumable.action";
import type { Consumable } from "../interfaces/consumable.interfaces";

export const useConsumablesCreateUpdate = () => {
    const queryClient = useQueryClient();

    // --- Mutación para Crear Consumible ---
    const createConsumableMutation = useMutation<Consumable, Error, FormData>({
        mutationFn: (payload: FormData) => createConsumableAction(payload),
        onSuccess: () => {
            // Invalida la lista global de consumibles
            queryClient.invalidateQueries({ queryKey: ["consumables"] });
            toast.success(t("consumable_hook_create_success") || "Consumible creado con éxito");
        },
        onError: (error: unknown) => {
            let message = t("consumable_hook_create_error_default") || "Error al crear consumible";
            if (isAxiosError(error)) {
                message = error.response?.data?.message || error.message;
            } else if (error instanceof Error) {
                message = error.message;
            }
            toast.error(Array.isArray(message) ? message.join(", ") : message);
        }
    });

    // --- Mutación para Actualizar Consumible ---
    const updateConsumableMutation = useMutation<Consumable, Error, { id: string; payload: FormData }>({
        mutationFn: ({ id, payload }) => updateConsumableAction(id, payload),
        onSuccess: (data) => {
            // Invalida listas e historiales
            queryClient.invalidateQueries({ queryKey: ["consumables"] });
            
            if (data?.id) {
                queryClient.invalidateQueries({ queryKey: ["consumable", String(data.id)] });
            } else {
                queryClient.invalidateQueries({ queryKey: ["consumable"] });
            }
            toast.success(t("consumable_hook_update_success") || "Consumible actualizado con éxito");
        },
        onError: (error: unknown) => {
            let message = t("consumable_hook_update_error_default") || "Error al actualizar consumible";
            if (isAxiosError(error)) {
                message = error.response?.data?.message || error.message;
            } else if (error instanceof Error) {
                message = error.message;
            }
            toast.error(Array.isArray(message) ? message.join(", ") : message);
        }
    });

    return {
        createConsumableAsync: createConsumableMutation.mutateAsync,
        updateConsumableAsync: updateConsumableMutation.mutateAsync,
        isCreating: createConsumableMutation.isPending,
        isUpdating: updateConsumableMutation.isPending,
    };
};

export const useConsumable = () => {
    const { id } = useParams<{ id: string }>();
    const isEditing = !!id && id !== "new";

    const consumableQuery = useQuery<Consumable, Error>({
        queryKey: ["consumable", id],
        // CORREGIDO: Se pasa el id como string directo, no envuelto en un objeto
        queryFn: () => getConsumableByIdAction(id!), 
        enabled: isEditing,
        refetchOnWindowFocus: false, 
        staleTime: 0, // Mantenemos tu configuración de ciclo de vida
        gcTime: 1000 * 60 * 10,
    });

    return {
        consumable: consumableQuery.data,
        isLoading: consumableQuery.isLoading,
        isError: consumableQuery.isError,
        error: consumableQuery.error,
        isEditing, 
    };
};
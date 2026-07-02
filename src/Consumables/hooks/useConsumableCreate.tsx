import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
// import { t } from "i18next";

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
            // Invalidamos las queries para refrescar la tabla al regresar
            queryClient.invalidateQueries({ queryKey: ["consumables"] });
        },
    });

    // --- Mutación para Actualizar Consumible ---
    const updateConsumableMutation = useMutation<Consumable, Error, { id: string; payload: FormData }>({
        mutationFn: ({ id, payload }) => updateConsumableAction(id, payload),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["consumables"] });
            
            if (data?.id) {
                queryClient.invalidateQueries({ queryKey: ["consumable", String(data.id)] });
            } else {
                queryClient.invalidateQueries({ queryKey: ["consumable"] });
            }
        },
    });

    return {
        // Exponemos mutateAsync para poder encadenar sileo.promise en tus componentes/páginas
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
        queryFn: () => getConsumableByIdAction(id!), 
        enabled: isEditing,
        refetchOnWindowFocus: false, 
        staleTime: 0,
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
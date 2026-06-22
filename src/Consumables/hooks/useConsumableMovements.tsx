import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useSearchParams } from "react-router";
import { registerConsumableOutput } from "../actions/post-consumable-movements.actions";
import { getMovementConsumablesAction } from "../actions/get-movement-consumables.actions";
import type { 
    CreateConsumableMovementDto,
} from "../interfaces/consumable-movement.interfaces";

// Estructura exacta que configuramos en el b

// --- HOOK: EJECUTAR MOVIMIENTO DE SALIDA ---
export const useConsumableMovements = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const executeOutputMovement = async (
        payload: CreateConsumableMovementDto,
        onSuccessCallback?: () => void
    ) => {
        setIsSubmitting(true);
        setError(null);
        try {
            const response = await registerConsumableOutput(payload);
            if (onSuccessCallback) {
                onSuccessCallback();
            }
            return response;
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Ocurrió un error inesperado";
            setError(message);
            throw err;
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        executeOutputMovement,
        isSubmitting,
        error,
        setError,
    };
};

export const useConsumableMovementsList = () => {
    const [searchParams] = useSearchParams();

    const limit = Number(searchParams.get("limit")) || 10;
    const page = Number(searchParams.get("page")) || 1;
    const offset = (page - 1) * limit;

    const search = searchParams.get("search")?.trim() || "";
    const id_movement_type = searchParams.get("id_movement_type") || "";
    const id_movement_aplication = searchParams.get("id_movement_aplication") || "";
    const id_departament_consumable = searchParams.get("id_departament_consumable") || "";
    const startDate = searchParams.get("startDate") || "";
    const endDate = searchParams.get("endDate") || "";

    const movementsQuery = useQuery({
        queryKey: [
            "consumable-movements", 
            { page, limit, search, id_movement_type, id_movement_aplication, id_departament_consumable, startDate, endDate }
        ],
        queryFn: async () => {
            return await getMovementConsumablesAction({ 
                limit, 
                offset, 
                search,
                id_movement_type,
                id_movement_aplication,
                id_departament_consumable,
                startDate,
                endDate
            });
        },
        staleTime: 30000,
        refetchOnWindowFocus: false,
        placeholderData: keepPreviousData, 
    });

    return {
        movements: movementsQuery.data?.data ?? [], 
        meta: movementsQuery.data?.meta ?? { total: 0, page: 1, lastPage: 1 },
        isLoading: movementsQuery.isLoading,
        isFetching: movementsQuery.isFetching,
        error: movementsQuery.error,
        refetch: movementsQuery.refetch,
    };
};
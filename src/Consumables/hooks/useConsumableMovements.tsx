// hooks/useConsumableMovements.ts
import { useState } from "react";
import { registerConsumableOutput } from "../actions/consumableMovements.actions";
import type { CreateConsumableMovementDto } from "../interfaces/consumable-movement.interfaces";

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
import axios from "axios"; 
import type { CreateConsumableMovementDto, ConsumableMovementResponse } from "../interfaces/consumable-movement.interfaces";
import { soporteTecnicoApi } from "../../api/soporteTecnicoApi";

export const registerConsumableOutput = async (
    payload: CreateConsumableMovementDto
): Promise<ConsumableMovementResponse> => {
    try {
        const { data } = await soporteTecnicoApi.post<ConsumableMovementResponse>("/consumable-movements/output", payload, {
        });
        return data;
    } catch (error: unknown) {
        const backendMessage = axios.isAxiosError(error)
            ? (error.response?.data as { message?: string | string[] })?.message
            : undefined;
        throw new Error(
            Array.isArray(backendMessage)
                ? backendMessage.join(", ")
                : backendMessage || "Error al procesar el movimiento de almacén.", { cause: error }
        );
    }
};
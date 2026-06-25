import { isAxiosError } from "axios";
import type { UseFormSetError, FieldValues, Path } from "react-hook-form";
import type { BackendError } from "@/interfaces/backendError.interfaces";

export interface ErrorMapping {
    backendKeyword: string;
    fieldPath: string; // Ruta exacta del campo mapeado en el register, ej: "consumable.description"
}

export const handleBackendErrors = <T extends FieldValues>(
    error: unknown,
    setError: UseFormSetError<T>,
    mappings: ErrorMapping[],
    defaultCallback?: (message: string) => void
) => {
    let backendMessage: string | string[];

    // 1. Intentar recuperar si es un error de Axios puro
    if (isAxiosError<BackendError>(error) && error.response?.data?.message) {
        backendMessage = error.response.data.message;
    } 
    // 2. Si es un objeto Error nativo de JS lanzado por la action (ej: Error: El campo name...)
    else if (error instanceof Error) {
        backendMessage = error.message;
    } 
    // 3. Si viene como un objeto plano, validamos de forma segura que tenga la propiedad 'message'
    else if (
        typeof error === "object" && 
        error !== null && 
        "message" in error && 
        (typeof (error as Record<string, unknown>).message === "string" || Array.isArray((error as Record<string, unknown>).message))
    ) {
        backendMessage = (error as Record<string, string | string[]>).message;
    } 
    // 4. Fallback si es un string directo o no se reconoce
    else {
        backendMessage = typeof error === "string" ? error : "Ocurrió un error inesperado de red.";
    }

    // Convertir a array si viene como string (NestJS maneja ambos formatos según la validación)
    const messages = Array.isArray(backendMessage) ? backendMessage : [backendMessage];

    messages.forEach((msg) => {
        if (typeof msg !== "string") return;

        // Buscar si el mensaje coincide con alguna palabra clave de mapeo para marcar el input
        const match = mappings.find((m) =>
            msg.toLowerCase().includes(m.backendKeyword.toLowerCase())
        );

        if (match) {
            setError(match.fieldPath as Path<T>, {
                type: "server",
                message: msg,
            }, { shouldFocus: true });
        }
    });

    // Pasamos SIEMPRE el mensaje limpio al callback para que Sileo lo pinte en la notificación
    if (defaultCallback) {
        defaultCallback(messages.join(", "));
    }
};

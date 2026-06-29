import { isAxiosError } from "axios";
import type { UseFormSetError, FieldValues, Path } from "react-hook-form";
import type { BackendError } from "@/interfaces/backendError.interfaces";

export interface ErrorMapping {
    backendKeyword: string;
    fieldPath: string;
}

export const handleBackendErrors = <T extends FieldValues>(
    error: unknown,
    setError: UseFormSetError<T>,
    mappings: ErrorMapping[],
    defaultCallback?: (message: string) => void
) => {
    let backendMessage: string | string[];

    if (isAxiosError<BackendError>(error) && error.response?.data?.message) {
        backendMessage = error.response.data.message;
    } 
    else if (error instanceof Error) {
        backendMessage = error.message;
    }
    else if (
        typeof error === "object" && 
        error !== null && 
        "message" in error && 
        (typeof (error as Record<string, unknown>).message === "string" || Array.isArray((error as Record<string, unknown>).message))
    ) {
        backendMessage = (error as Record<string, string | string[]>).message;
    }
    else {
        backendMessage = typeof error === "string" ? error : "Ocurrió un error inesperado de red.";
    }

    const messages = Array.isArray(backendMessage) ? backendMessage : [backendMessage];

    messages.forEach((msg) => {
        if (typeof msg !== "string") return;
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

    if (defaultCallback) {
        defaultCallback(messages.join(", "));
    }
};

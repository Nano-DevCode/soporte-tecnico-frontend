// utils/backendFormHandlers.ts
import { isAxiosError } from "axios";
import { sileo } from "sileo";
import type { BackendError } from "@/interfaces/backendError.interfaces";
import type { FieldValues, Path, UseFormSetError } from "react-hook-form";

interface HandleErrorsArgs {
    error: unknown;
    defaultTitle?: string;
}

export const handleBackendFormErrors = ({
    error,
    defaultTitle = "Error en el servidor",
}: HandleErrorsArgs): boolean => {

    let backendMessages: string[] = [];
    let globalMessage = "Ocurrió un error inesperado.";

    if (isAxiosError<BackendError>(error) && error.response?.data?.message) {
        const msg = error.response.data.message;
        backendMessages = Array.isArray(msg) ? msg : [msg];
        globalMessage = backendMessages[0];
    } else if (error instanceof Error) {
        globalMessage = error.message.replace(/^Error:\s*/i, "");
    } else if (typeof error === "string") {
        globalMessage = error;
    }

    if (backendMessages.length > 1) {
        globalMessage = backendMessages.join("\n");
    }

    sileo.error({
        title: defaultTitle,
        description: globalMessage,
        duration: 6000,
    });

    return true;
};

interface SetErrorOptions {
    defaultMessage?: string;
    onGlobalError?: (message: string) => void;
}

export const handleBackendFormErrorsEq = <T extends FieldValues>(
    error: unknown,
    setError: UseFormSetError<T>,
    options: SetErrorOptions = {}
) => {
    const { onGlobalError } = options;

    let message: string | string[] | Record<string, string | string[]> | null = null;

    // Aceptar tanto Axios puro como el objeto que procesó tu "action"
    if (isAxiosError<BackendError>(error) && error.response?.data) {
        message = error.response.data.message;
    } else if (error && typeof error === "object" && "message" in error) {
        message = (error as { message: string | string[] | Record<string, string | string[]> }).message;
    }

    if (!message) {
        if (onGlobalError && error instanceof Error) onGlobalError(error.message || "Ocurrió un error al procesar.");
        return;
    }
    else if (Array.isArray(message)) {
        const unmappedErrors: string[] = [];

        message.forEach((msg) => {
            const matchedField = Object.keys(setError as unknown as object).find((field) =>
                msg.toLowerCase().includes(field.toLowerCase())
            );

            if (matchedField) {
                setError(matchedField as Path<T>, {
                    type: "backend",
                    message: msg,
                });
            } else {
                unmappedErrors.push(msg);
            }
        });

        if (unmappedErrors.length > 0 && onGlobalError) {
            onGlobalError(unmappedErrors.join(", "));
        }
        return;
    }

    else if (typeof message === "object" && message !== null) {
        Object.entries(message).forEach(([key, val]) => {
            setError(key as Path<T>, {
                type: "backend",
                message: Array.isArray(val) ? val.join(", ") : String(val),
            });
        });
        return;
    }
    else if (typeof message === "string") {
        const msgLower = message.toLowerCase();

        // Agregamos "inventory" para que soporte el mensaje en inglés
        if (
            msgLower.includes("inventario") ||
            msgLower.includes("num_inventario") ||
            msgLower.includes("inventory")
        ) {
            setError("num_inventario" as Path<T>, {
                type: "backend",
                message: message,
            });
            return; // Detiene la ejecución para que no salte al onGlobalError global
        }

        if (onGlobalError) {
            onGlobalError(message);
        }
    }
};

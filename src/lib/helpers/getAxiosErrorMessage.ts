import { isAxiosError } from "axios";

export const getAxiosErrorMessage = (error: Error | null) => {
    let errorMessage = 'Por favor revisa tu conexión a internet e inténtalo de nuevo.';

    if (isAxiosError(error) && error.response) {
        errorMessage = error.response.data?.message || "Error de validación en el servidor.";
    } else if (error instanceof Error) {
        errorMessage = error.message;
    }
    return errorMessage;
}
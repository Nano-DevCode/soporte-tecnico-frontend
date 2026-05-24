import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";
import type { PrinterTypeFunction } from "./get-printertypefuction.action";
import { t } from "i18next";

/**
 * Ajustamos el payload para manejar tanto el string directo como el objeto { name: string }.
 * Esto previene errores de ejecución al usar el factory de catálogos en tu proyecto de tickets.
 */
export const createPrinterTypeFunctionAction = async (payload: string | { name: string }): Promise<PrinterTypeFunction> => {
    try {
        // 1. Extraemos el nombre dinámicamente según el tipo de dato recibido
        const nameValue = typeof payload === 'string' ? payload : payload.name;

        if (!nameValue) {
            throw new Error(t("api_printer_function_name_required"));
        }

        const cleanedName = nameValue.trim();

        // 2. Enviamos la petición al endpoint de funciones de impresora de NestJS
        const { data } = await soporteTecnicoApi.post<PrinterTypeFunction>('/printerfunctiontypes', {
            name: cleanedName
        });

        return data;
    } catch (error: unknown) {
        const errorMessage = (error as { response?: { data?: { message?: string } } }).response?.data?.message;

        // Manejo de errores de validación del backend
        if (Array.isArray(errorMessage)) {
            throw new Error(errorMessage.join(", "));
        }

        throw new Error(errorMessage || t("api_printer_function_create_error"));
    }
};
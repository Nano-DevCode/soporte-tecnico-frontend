import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";
import type { PrinterTypeFunction } from "./get-printertypefuction.action";

/**
 * Ajustamos el payload para manejar tanto el string directo como el objeto { name: string }.
 * Esto previene errores de ejecución al usar el factory de catálogos en tu proyecto de tickets.
 */
export const createPrinterTypeFunctionAction = async (payload: string | { name: string }): Promise<PrinterTypeFunction> => {
    try {
        // 1. Extraemos el nombre dinámicamente según el tipo de dato recibido
        const nameValue = typeof payload === 'string' ? payload : payload.name;

        if (!nameValue) {
            throw new Error("El nombre de la función de impresora es requerido.");
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

        throw new Error(errorMessage || "Error al registrar el Tipo de Función de Impresora.");
    }
};

// import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";
// import type { PrinterTypeFunction } from "./get-printertypefuction.action";

// export const createPrinterTypeFunctionAction = async (name: string): Promise<PrinterTypeFunction> => {
//     try {
//         // Normalizamos un poco en el front antes de enviar, 
//         // aunque el back tiene su propia función cleanString
//         const cleanedName = name.trim();

//         const { data } = await soporteTecnicoApi.post<PrinterTypeFunction>('/printerfunctiontypes', {
//             name: cleanedName
//         });

//         return data;
//     } catch (error: any) {
//         // Captura BadRequestException, ConflictException e InternalServerErrorException
//         const errorMessage = error.response?.data?.message;

//         if (Array.isArray(errorMessage)) {
//             throw new Error(errorMessage.join(", "));
//         }

//         // Aquí capturamos el ConflictException: `El tipo de equipo de computadora "${cleanedName}" ya existe.`
//         throw new Error(errorMessage || "Error al registrar el Tipo de Función de Impresora.");
//     }
// };
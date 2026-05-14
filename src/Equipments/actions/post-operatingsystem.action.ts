import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";
import type { OperatingSystem } from "./get-operatingsystem.action";

/**
 * Ajustamos el payload para manejar tanto el string directo como el objeto { name: string }.
 * Esto previene errores de ejecución al usar el factory de catálogos.
 */
export const createOperatingSystemAction = async (payload: string | { name: string }): Promise<OperatingSystem> => {
    try {
        // 1. Extraemos el nombre dinámicamente según el tipo de dato recibido
        const nameValue = typeof payload === 'string' ? payload : payload.name;

        if (!nameValue) {
            throw new Error("El nombre del sistema operativo es requerido.");
        }

        const cleanedName = nameValue.trim();

        // 2. Enviamos la petición al endpoint de NestJS
        const { data } = await soporteTecnicoApi.post<OperatingSystem>('/operatingsystems', {
            name: cleanedName
        });

        return data;
    } catch (error: unknown) {
        const errorMessage = (error as { response?: { data?: { message?: string } } }).response?.data?.message;

        // Manejo de errores de validación del backend (ej. nombres duplicados)
        if (Array.isArray(errorMessage)) {
            throw new Error(errorMessage.join(", "));
        }

        throw new Error(errorMessage || "Error al registrar el Sistema Operativo.");
    }
};

// import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";
// import type { OperatingSystem } from "./get-operatingsystem.action";

// export const createOperatingSystemAction = async (name: string): Promise<OperatingSystem> => {
//     try {
//         // Normalizamos un poco en el front antes de enviar, 
//         // aunque el back tiene su propia función cleanString
//         const cleanedName = name.trim();

//         const { data } = await soporteTecnicoApi.post<OperatingSystem>('/operatingsystems', {
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
//         throw new Error(errorMessage || "Error al registrar el Sistema Operativo.");
//     }
// };
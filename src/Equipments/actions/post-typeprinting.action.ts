import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";
import type { TypePrinting } from "./get-typeprinting.action";

/**
 * Ajustamos el payload para manejar tanto string directo como el objeto { name: string }.
 * Esto asegura que el factory de catálogos funcione correctamente sin errores de tipo.
 */
export const createTypePrintingAction = async (payload: string | { name: string }): Promise<TypePrinting> => {
    try {
        // 1. Extraemos el nombre dinámicamente según lo que envíe el componente
        const nameValue = typeof payload === 'string' ? payload : payload.name;

        if (!nameValue) {
            throw new Error("El nombre del tipo de impresión es requerido.");
        }

        const cleanedName = nameValue.trim();

        // 2. Petición al endpoint de tipos de impresión en NestJS
        const { data } = await soporteTecnicoApi.post<TypePrinting>('/printingtypes', {
            name: cleanedName
        });

        return data;
    } catch (error: unknown) {
        // Captura de excepciones del backend
        const errorMessage = (error as { response?: { data?: { message?: string } } }).response?.data?.message;

        if (Array.isArray(errorMessage)) {
            throw new Error(errorMessage.join(", "));
        }

        throw new Error(errorMessage || "Error al registrar el tipo de impresión.");
    }
};

// import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";
// import type { TypePrinting } from "./get-typeprinting.action";

// export const createTypePrintingAction = async (name: string): Promise<TypePrinting> => {
//     try {
//         // Normalizamos un poco en el front antes de enviar, 
//         // aunque el back tiene su propia función cleanString
//         const cleanedName = name.trim();

//         const { data } = await soporteTecnicoApi.post<TypePrinting>('/printingtypes', {
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
//         throw new Error(errorMessage || "Error al registrar el tipo de impresión.");
//     }
// };
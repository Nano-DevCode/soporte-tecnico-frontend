import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";
import type { typeNetwork } from "./get-networktype.action";

/**
 * Ajustamos el payload para recibir string o el objeto { name: string }
 * que suele enviar el componente de creación rápida.
 */
export const createNetworkTypeAction = async (payload: string | { name: string }): Promise<typeNetwork> => {
    try {
        // 1. Extraemos el nombre dinámicamente según el tipo de dato recibido
        const nameValue = typeof payload === 'string' ? payload : payload.name;

        if (!nameValue) {
            throw new Error("El nombre del tipo de red es requerido.");
        }

        const cleanedName = nameValue.trim();

        // 2. Realizamos la petición POST al endpoint de redes
        const { data } = await soporteTecnicoApi.post<typeNetwork>('/typenetworks', {
            name: cleanedName
        });

        return data;
    } catch (error: unknown) {
        const errorMessage = (error as { response?: { data?: { message?: string } } }).response?.data?.message;

        if (Array.isArray(errorMessage)) {
            throw new Error(errorMessage.join(", "));
        }

        // Proporcionamos un mensaje de error por defecto si el servidor no envía uno
        throw new Error(errorMessage || "Error al registrar el tipo de red.");
    }
};


// import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";
// import type { typeNetwork } from "./get-networktype.action";

// export const createNetworkTypeAction = async (name: string): Promise<typeNetwork> => {
//     try {
//         // Normalizamos un poco en el front antes de enviar, 
//         // aunque el back tiene su propia función cleanString
//         const cleanedName = name.trim();

//         const { data } = await soporteTecnicoApi.post<typeNetwork>('/typenetworks', {
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
//         throw new Error(errorMessage || "Error al registrar el tipo de red.");
//     }
// };
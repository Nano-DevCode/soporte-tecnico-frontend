import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";
import type { Brand } from "./get-brand.action";

/**
 * Ajustamos el tipo de entrada para aceptar un string (creación rápida)
 * o un objeto (Deducción automática del factory)
 */
export const createBrandAction = async (payload: string | { name: string }): Promise<Brand> => {
    try {
        // 1. Extraemos el valor del nombre de forma segura
        const nameValue = typeof payload === 'string' ? payload : payload.name;

        if (!nameValue) {
            throw new Error("El nombre de la marca es requerido.");
        }

        // 2. Normalización consistente con tus otros módulos de software
        const cleanedName = nameValue.trim().replace(/\s+/g, ' ');

        // 3. Petición al backend de NestJS
        const { data } = await soporteTecnicoApi.post<Brand>('/brands', {
            name: cleanedName
        });

        return data;
    } catch (error: unknown) {
        const errorMessage = (error as { response?: { data?: { message?: string } } }).response?.data?.message;

        // Manejo de errores detallado (ValidationPipe o ConflictException)
        throw new Error(
            Array.isArray(errorMessage)
                ? errorMessage.join(", ")
                : errorMessage || "Error al registrar la marca."
        );
    }
};

// import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";
// import type { Brand } from "./get-brand.action";


// export const createBrandAction = async (name: string): Promise<Brand> => {
//     try {
//         const cleanedName = name.trim().replace(/\s+/g, ' ');

//         // Solo enviamos el name. El backend genera el ID.
//         const { data } = await soporteTecnicoApi.post<Brand>('/brands', {
//             name: cleanedName
//         });

//         return data;
//     } catch (error: any) {
//         const errorMessage = error.response?.data?.message;
//         throw new Error(Array.isArray(errorMessage) ? errorMessage.join(", ") : errorMessage || "Error al registrar la marca.");
//     }
// };

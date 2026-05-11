import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";

// Definimos la interfaz para el DTO de NestJS
interface CreateModelDto {
    name: string;
    id_brand: string;
}

export const createModelAction = async (payload: string | { name: string }, id_brand: string) => {
    try {
        // 1. Extraemos el nombre (manejamos string o el objeto que envía el factory)
        const nameValue = typeof payload === 'string' ? payload : payload.name;

        if (!nameValue) throw new Error("El nombre del modelo es requerido");
        if (!id_brand) throw new Error("Se requiere una marca para registrar el modelo");

        const cleanedName = nameValue.trim().replace(/\s+/g, ' ');

        // 2. Enviamos el objeto al backend de NestJS
        const { data } = await soporteTecnicoApi.post<CreateModelDto>('/models', { 
            name: cleanedName, 
            id_brand 
        });

        return data; 
    } catch (error: unknown) {
        const errorMessage = (error as { response?: { data?: { message?: string } } }).response?.data?.message || "Error al registrar el modelo";
        throw new Error(Array.isArray(errorMessage) ? errorMessage.join(", ") : errorMessage);
    }
};

// // actions/post-model.action.ts
// import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";

// export const createModelAction = async (name: string, id_brand: string) => {
//     try {
//         // Verifica que los nombres de los campos coincidan con tu DTO de NestJS
//         // Normalmente el backend espera { name: string, id_brand: string }
//         const { data } = await soporteTecnicoApi.post('/models', { 
//             name, 
//             id_brand 
//         });
//         return data; // Debe retornar { id: "...", name: "..." }
//     } catch (error: any) {
//         const errorMessage = error.response?.data?.message || "Error al registrar el modelo";
//         throw new Error(Array.isArray(errorMessage) ? errorMessage.join(", ") : errorMessage);
//     }
// };
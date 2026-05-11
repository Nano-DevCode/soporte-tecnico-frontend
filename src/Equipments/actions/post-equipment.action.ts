/* eslint-disable @typescript-eslint/no-explicit-any */
import { isAxiosError } from "axios";
import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";

export interface EquipmentPayload {
    id?: string;
    num_inventario: string;
    id_model: string;
    id_type_equipment: string | number; // Cambiado a string|number por la flexibilidad del form
    id_departament?: string; // Corregido el typo 'departament' a 'department' si coincide con tu back
    id_responsable?: string;
    description?: string;
    status?: boolean;



    
    computer?: {
        id_processor: string;
        ram: string;
        capacity_storage: string;
        id_type_operating_system: string;
        id_type_storage: string;
        id_type_equipment_computer: string;
        available_storage?: string; // Añadido si lo usas en el form
    };
    printer?: {
        id_type_function: string;
        id_type_printing: string;
        color: boolean;
        model_toner: string;
    };
    network?: {
        id_type_equipment_network: string;
        number_ports: number;
        PoE: boolean;
    };
}

/**
 * Función auxiliar para limpiar el payload según el tipo de equipo
 */
const cleanEquipmentPayload = (payload: any): any => {
    const typeId = String(payload.id_type_equipment);
    
    // 1. Creamos una copia
    const cleaned = { ...payload };

    
    // 3. AGREGAR STATUS (El backend dice que es obligatorio)
    cleaned.status = true; 

    // 4. ELIMINAR LO QUE EL BACKEND PROHÍBE
    // El backend dice: 'property id_brand should not exist'
    delete cleaned.id_brand; 

    // 5. Limpieza por tipo (lo que ya tenías)
    if (typeId !== "1") delete cleaned.computer;
    if (typeId !== "3") delete cleaned.printer;
    if (typeId !== "2") delete cleaned.network;

    return cleaned;
};
/**
 * Acción para crear un nuevo equipo
 */
export const createEquipmentAction = async (payload: EquipmentPayload) => {
    try {
        const dataToSend = cleanEquipmentPayload(payload);
        const { data } = await soporteTecnicoApi.post("/equipments", dataToSend);
        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            console.error("Server Error (Create):", error.response?.data);
            throw error.response?.data; // Lanzamos el error del server para que el Hook lo capture
        }
        throw error;
    }
};

/**
 * Acción para actualizar un equipo existente
 */
export const updateEquipmentAction = async (id: string, payload: Partial<EquipmentPayload>) => {
    try {
        // En update, solo limpiamos si el payload contiene id_type_equipment
        let dataToSend = payload;
        if (payload.id_type_equipment) {
            dataToSend = cleanEquipmentPayload(payload as EquipmentPayload);
        }

        const { data } = await soporteTecnicoApi.patch(`/equipments/${id}`, dataToSend);
        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            console.error("Server Error (Update):", error.response?.data);
            throw error.response?.data;
        }
        throw error;
    }
};

// import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";
// import type { CreateEquipmentDTO } from "../interfaces/responsable.interface";

// // create-equipment.action.ts

// export const createEquipmentAction = async (payload: Partial<CreateEquipmentDTO>) => {
//     try {
//         // eslint-disable-next-line @typescript-eslint/no-explicit-any
//         const cleanPayload = { ...(payload ) } as Record<string, any>;

//         // 1. Eliminar campos que Zod ya movió a los sub-objetos
//         // Pero OJO: Solo eliminarlos de la raíz
//         const fieldsToMove = [
//             'id_type_equipment_computer', 'id_type_storage', 'id_operating_system',
//             'id_processor', 'ram', 'capacity_storage', 'available_storage',
//             'id_type_equipment_network', 'number_ports', 'PoE',
//             'id_type_function', 'id_type_printing', 'color', 'model_toner'
//         ];

//         // 2. Eliminar basura de la UI que no procesó el transform
//         const uiOnlyFields = [
//             'newBrandName', 'newModelName', 'newResponsible',
//             'newComputerTypeEquipment', 'newStorageType', 'newOperatingSystem', 'newProcessor',
//             'newTypeNetwork', 'newTypeFunction', 'newTypePrinting'
//         ];

//         [...fieldsToMove, ...uiOnlyFields].forEach(key => delete cleanPayload[key]);

//         // 3. Asegurar que los IDs no sean objetos (si usas Selects que devuelven objetos)
//         if (typeof cleanPayload.id_brand === 'object') cleanPayload.id_brand = cleanPayload.id_brand.id;
//         if (typeof cleanPayload.id_model === 'object') cleanPayload.id_model = cleanPayload.id_model.id;

//         const { data } = await soporteTecnicoApi.post('/equipments', cleanPayload);
//         return data;
//     } catch (error: unknown) {
//         // ... manejo de error igual
//         const errorMessage = (error as { response?: { data?: { message?: string } } }).response?.data?.message;
//         const finalMessage = Array.isArray(errorMessage) ? errorMessage.join(" | ") : errorMessage;

//         throw new Error(finalMessage || "Error inesperado al crear el equipo");
//     }
// };

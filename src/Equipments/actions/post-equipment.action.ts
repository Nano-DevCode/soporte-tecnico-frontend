/* eslint-disable @typescript-eslint/no-explicit-any */
import { isAxiosError } from "axios";
import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";

export interface EquipmentPayload {
    id?: string;
    num_inventario?: string;
    id_model?: string;
    id_type_equipment?: string | number; // Cambiado a string|number por la flexibilidad del form
    id_departament?: string; // Corregido el typo 'departament' a 'department' si coincide con tu back
    id_responsable?: string;
    description?: string;
    status?: boolean;

    computer?: {
        id_processor?: string;
        ram?: string;
        capacity_storage?: string;
        id_type_operating_system?: string;
        id_type_storage?: string;
        id_type_equipment_computer?: string;
        available_storage: string; // Añadido si lo usas en el form
    };
    printer?: {
        id_type_function?: string;
        id_type_printing: string;
        color?: boolean;
        model_toner?: string;
    };
    network?: {
        id_type_equipment_network?: string;
        number_ports: number;
        PoE: boolean;
    };
}

/**
 * Función auxiliar para limpiar el payload según el tipo de equipo
 */
const cleanEquipmentPayload = (payload: any): any => {
    // Aseguramos que sea string para la comparación
    const typeId = String(payload.id_type_equipment);
    const cleaned = { ...payload };

    // Eliminamos metadatos que el backend no espera en el body
    delete cleaned.id;
    delete cleaned.id_brand;
    // Eliminar objetos de relación si el backend solo espera strings (doble seguridad)
    if (typeof cleaned.id_model === 'object') cleaned.id_model = cleaned.id_model.id;

    // Lógica de exclusión según tipo
    if (typeId === "1") { // Computer
        delete cleaned.printer;
        delete cleaned.network;
    } else if (typeId === "3") { // Printer
        delete cleaned.computer;
        delete cleaned.network;
    } else if (typeId === "2") { // Network
        delete cleaned.computer;
        delete cleaned.printer;
    } else {
        delete cleaned.computer;
        delete cleaned.printer;
        delete cleaned.network;
    }
    if (cleaned.status === undefined) cleaned.status = true;
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

export const updateEquipmentAction = async (id: string, payload: Partial<EquipmentPayload>) => {
    try {
        // 1. Clonamos para evitar mutar el estado original del formulario
        const dataToProcess = { ...payload };

        // 2. IMPORTANTE: El ID no debe viajar en el cuerpo del PATCH si el backend es estricto
        delete dataToProcess.id;

        // 3. Limpiamos y filtramos según el tipo de equipo
        // Esto evita enviar specs de 'printer' si estás editando una 'computer'
        const dataToSend = cleanEquipmentPayload(dataToProcess);

        // 4. Petición al endpoint específico
        const { data } = await soporteTecnicoApi.patch(`/equipments/${id}`, dataToSend);

        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            // Loguear el error detallado ayuda mucho durante el desarrollo del "Proyecto Tickets"
            console.error("Update Error Details:", error.response?.data);
            throw error.response?.data;
        }
        throw error;
    }
};

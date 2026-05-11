export interface CreateEquipmentDTO {
    num_inventario: string;
    id_model: number | null;
    id_type_equipment: number;
    id_responsable: string | null; // <-- Asegúrate de que esto coincida con el ID del responsable
    description?: string;
    computer?: any;
    printer?: any;
    network?: any;
}
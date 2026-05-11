export interface CreateEquipmentDto {
    num_inventario: string;
    serie: string;
    id_brand: string;
    id_model: string;
    id_responsable: string;
    id_departament: string;
    id_type_equipment: string;

    // Objetos opcionales según el tipo
    computer?: {
        id_processor: string;
        id_type_operating_system: string;
        id_type_storage: string;
        id_type_equipment_computer: string;
        ram: number;
        capacity_storage: string;
    };

    printer?: {
        id_type_function: string;
        id_type_printing: string;
        model_toner: string;
        color: boolean;
    };

    network?: {
        id_type_network: string;
        ip_address: string;
        mac_address: string;
        node_port: string;
    };
}
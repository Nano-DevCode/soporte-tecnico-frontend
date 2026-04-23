
export type EquipmentCategory = 'computer' | 'printer' | 'network' | 'computadora' | 'impresora' | 'red' | 'all' | string;

export interface Equipment {
  id: string;
  folio: string;          // Coincide con eq.num_inventario mapeado
  type: string;           // "computer", "printer", o "network"
  model: string;
  responsableName: string;
  status: boolean;

  // --- Datos de Computadora ---
  processor?: string;
  processormodel?: string;       // Agregado para coincidir con tu mapToDto
  processordescription?: string; // Agregado para coincidir con tu mapToDto
  ram?: string;
  storage?: string;
  operatingSystem?: string;

  // --- Datos de Impresora ---
  typefunction?: string;
  typeprinting?: string;
  color?: string;         // ¡Importante! Lo agregamos en el Service
  modelToner?: string;    // ¡Importante! Lo agregamos en el Service

  // --- Datos de Red ---
  typeEquipmentNetwork?: string;
  numberPorts?: number;
  PoE?: boolean;          // Mantenemos las mayúsculas como en la entidad
}
export interface Meta {
  total: number;
  page: number;
  lastPage: number; // Asegúrate de que diga lastPage
}

export interface EquipmentResponse {
  data: Equipment[];
  meta: Meta;
}


export interface EquipmentOne {
  id: string;
  num_inventario: string;
  id_model: {
    name: string; // "Modelo Universal IMP"
  };
  computer?: {
    ram: string;
    capacity_storage: string;
    id_type_operating_system: {
      name: string; // "AlmaLinux"
    };
    id_processor: {
      brand: string; // "AMD"
      model: string; // "A4-6210 APU"
      description: string; // "1.80 GHz"
    };
  };
  printer?: {
    id_type_function: {
      name: string; // "Multifuncional"
    };
    id_type_printing: {
      name: string; // "Inyección de tinta"
    };
    color: string; // "Sí"
    model_toner: string; // "Toner Universal IMP"
  };
  network?: {
    id_type_equipment_network: {
      name: string; // "Switch"
    };
    number_ports: number; // 24
    PoE: boolean; // true
  };
  // ... otros campos como printer o network si no son null
}
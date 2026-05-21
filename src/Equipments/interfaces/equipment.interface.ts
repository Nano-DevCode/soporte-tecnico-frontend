export type EquipmentCategory = 'computer' | 'printer' | 'network' | 'computadora' | 'impresora' | 'red' | 'all' | string;

export interface Equipment {
  id: string;
  folio: string;          
  type: string;           // "computer", "printer", o "network"
  model: string;
  responsableName: string;
  status: boolean;
  departamento?: string;// Agregado para mostrar en la tabla, coincide con eq.departamento mapeado
       // Agregado para mostrar el departamento en la tabla
  description?: string;   // Solo para mostrar en la tabla si es diferente

  // --- Datos de Computadora ---
  processor?: string;
  processormodel?: string;       // Agregado para coincidir con tu mapToDto
  processordescription?: string; 
  ram?: string;
  storage?: string;
  operatingSystem?: string;

  // --- Datos de Impresora ---
  typefunction?: string;
  typeprinting?: string;
  color?: string;         
  modelToner?: string;  

  // --- Datos de Red ---
  typeEquipmentNetwork?: string;
  numberPorts?: number;
  PoE?: boolean;          
}




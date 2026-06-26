import type { EquipmentSummary } from "@/Equipments/interfaces/euipment-item.interface";

export interface TechnicalReportDetails {
    id:             string;
    diagnosis:      string;
    work_performed: string;
    materials_used?:string | null;
    is_resolved:    boolean;
    created_at:     string;
    updated_at:     string;
    fault_validity: FaultValidity;
    equipments?:    EquipmentSummary[];
}

export interface FaultValidity {
    id:                  string;
    name:                string;
    description:         string;
    penalizes_equipment: boolean;
}

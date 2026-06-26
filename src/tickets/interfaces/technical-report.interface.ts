import type { FaultValidity } from "@/technical-reports/interfaces/technical-report-details.interface";

export interface TechnicalReport {
    id:             string;
    diagnosis:      string;
    work_performed: string;
    materials_used: string | null;
    is_resolved:    boolean;
    fault_validity: FaultValidity;
    created_at:     Date;
    updated_at:     Date;
}

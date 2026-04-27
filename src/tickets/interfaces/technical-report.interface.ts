export interface TechnicalReport {
    id:             string;
    diagnosis:      string;
    work_performed: string;
    materials_used: string | null;
    is_resolved:    boolean;
    created_at:     Date;
    updated_at:     Date;
}

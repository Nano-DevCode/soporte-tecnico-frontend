export interface UpdateTechnicalReportPayload {
    diagnosis:          string;
    work_performed:     string;
    materials_used?:    string;
    equipment_ids?:     string[]
    fault_validity_id:  string
}

export interface UpdateTechnicalReportResponse {
    id:              string;
    diagnosis:       string;
    work_performed:  string;
    materials_used?: string;
    is_resolved:     boolean;
    created_at:      string;
    updated_at:      string;
}

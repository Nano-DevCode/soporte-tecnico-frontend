export interface InterveneTicketPayload {
    diagnosis:           string;
    work_performed:      string;
    materials_used?:     string | undefined;
    is_resolved:         boolean;
    equipment_ids:       string[] | undefined;
    fault_validity_id:   string;
    tags:                string[] | undefined;
}

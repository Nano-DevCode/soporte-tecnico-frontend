export interface ResponseDetails {
    id:               string;
    diagnosis:        string;
    work_done:        string;
    created_at:       string;
    updated_at:       string;
    ticket:           TicketResponse;
    maintenance_type: CeType;
    service_type:     CeType;
}

export interface CeType {
    id:         string;
    name:       string;
    created_at: string;
    updated_at: string;
}

export interface TicketResponse {
    id:                 string;
    folio:              string;
    description:        string;
    affected_name:      string;
    evidence_url:       null;
    contact_email:      string;
    available_hours:    string;
    equipment_location: string;
    priority:           number;
    version:            number;
    internal_folio:     string;
    created_at:         string;
    updated_at:         string;
    documents:          Document[];
}

export interface Document {
    id:            string;
    url:           string;
    name:          string;
    created_at:    string;
    updated_at:    string;
    type_document: TypeDocument;
}

export interface TypeDocument {
    id:          number;
    name:        string;
    description: string;
    created_at:  string;
    updated_at:  string;
}

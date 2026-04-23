export interface CreateTicketPayload {
    description:        string;
    affected_name:      string;
    evidence_url?:      string | undefined;
    contact_email:      string;
    available_hours:    string;
    equipment_location: string;
    issue_type:         number;
}

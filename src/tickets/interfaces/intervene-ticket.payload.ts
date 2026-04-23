export interface InterveneTicketPayload {
    diagnosis:           string;
    work_performed:      string;
    required_materials?: string | undefined;
    is_resolved:         boolean;
}

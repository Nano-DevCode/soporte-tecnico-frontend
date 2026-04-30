import type { Tag } from "@/common/tags/interfaces/tag.interface";
import type { TicketStatusCode } from "./ticket-status-code.interface";

export interface TicketDetailsResponse {
    id:                 string;
    folio:              string;
    description:        string;
    affected_name:      string;
    evidence_url:       string;
    contact_email:      string;
    available_hours:    string;
    equipment_location: string;
    currentStatusCode:  TicketStatusCode;
    priority:           number;
    version:            number;
    documents:          Document[];
    internal_folio:     string | null;
    created_at:         Date;
    updated_at:         Date;
    issue_type:         IssueType;
    tags:               Tag[];
    ticket_histories:   TicketHistory[];
    jefe_depto:         User;
    attends:            Attend[];
    coordinator:        User;
}

export interface IssueType {
    id:           number;
    name:         string;
    description?: string;
    created_at:   Date;
    updated_at:   Date;
}

export interface TicketHistory {
    id:         string;
    duration:   number;
    created_at: Date;
    updated_at: Date;
    status:     Status;
}

export interface Status {
    id:           number;
    name:         string;
    description?: string;
    created_at:   Date;
    updated_at:   Date;
    code:         TicketStatusCode;
}

export interface User {
    id:              string;
    idTelegram:      null;
    name:            string;
    paternalSurname: string;
    maternalSurname: string;
    num_control:     string;
    rfc:             null;
    department:      Department;
}

export interface Department {
    id:       string;
    name:     string;
    priority: string;
    status:   boolean;
    folio:    string;
    acronym:  string;
}

export interface Attend {
    id:           string;
    is_active:    boolean;
    is_attending: boolean;
    assigned_at:  Date;
    updated_at:   Date;
    technician:   User;
}

export interface Document {
    id:            string;
    url:           string;
    name:          string;
    created_at:    Date;
    updated_at:    Date;
    type_document: IssueType;
}

export const TYPE_DOCUMENT_NAME = {
    SERVICE_REQUEST_FORM: "Formato de Solicitud",
    WORK_ORDER_FORM: "Orden de Trabajo"
}

export type TYPE_DOCUMENT_NAME = typeof TYPE_DOCUMENT_NAME[keyof typeof TYPE_DOCUMENT_NAME];
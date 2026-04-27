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
    internal_folio:     null;
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

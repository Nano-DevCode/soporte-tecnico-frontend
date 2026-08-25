import type { Tag } from "@/common/tags/interfaces/tag.interface";
import type { Document } from "./ticket-details.response";

export interface Ticket {
    id:            string;
    folio:         string;
    internal_folio: string | null;
    status:        string;
    status_code:   string;
    priority:      number;
    description:   string;
    tags:          Tag[];
    jefe_depto:    JefeDepto;
    issue_type:    IssueType;
    school_period: SchoolPeriod;
    documents:     Document[];
    created_at:    Date;
}

export interface IssueType {
    name: string;
    id:   number;
}

export interface JefeDepto {
    id:        string;
    full_name: string;
    email:     string;
    department: Department;
}

export interface Department {
    id:       string;
    name:     string;
}

export interface SchoolPeriod {
    name: string;
    id:   string;
}

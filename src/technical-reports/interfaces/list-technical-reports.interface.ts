export interface TechnicalReport {
    data: SimpleTicket[];
    meta: Meta;
}

export interface SimpleTicket {
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
    internal_folio:     null | string;
    created_at:         Date;
    updated_at:         Date;
    issue_type:         IssueType;
    technical_reports:  TechnicalReportElement[];
}

export interface IssueType {
    id:          number;
    name:        string;
    description: string;
    created_at:  Date;
    updated_at:  Date;
}

export interface TechnicalReportElement {
    id:             string;
    diagnosis:      string;
    work_performed: string;
    materials_used: null;
    is_resolved:    boolean;
    created_at:     Date;
    updated_at:     Date;
}

export interface Meta {
    total:           number;
    limit:           number;
    page:            number;
    totalPages:      number;
    hasNextPage:     boolean;
    hasPreviousPage: boolean;
    lastPage:        number;
}

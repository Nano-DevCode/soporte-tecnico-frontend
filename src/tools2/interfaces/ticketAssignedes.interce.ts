export interface TicketsAssignedesResponse {
    id:            string;
    folio:         string;
    status:        string;
    status_code:   string;
    priority:      number;
    description:   string;
    jefe_depto:    JefeDepto;
    issue_type:    IssueType;
    school_period: SchoolPeriod;
    created_at:    Date;
}

export interface IssueType {
    name: string;
    id:   number;
}

export interface JefeDepto {
    id:         string;
    full_name:  string;
    email:      string;
    department: SchoolPeriod;
}

export interface SchoolPeriod {
    name: string;
    id:   string;
}

export interface Ticket {
    id:         string;
    folio:      string;
    status:     string;
    status_code:string;
    priority:   number;
    jefe_depto: JefeDepto;
    issue_type: IssueType;
    created_at: Date;
}

export interface IssueType {
    name: string;
    id:   number;
}

export interface JefeDepto {
    id:        string;
    full_name: string;
    email:     string;
}
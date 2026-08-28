export interface TechnicianKpiResponse {
    staffs: Staff[];
    meta:   Meta;
}

export interface Meta {
    total:    number;
    page:     number;
    lastPage: number;
}

export interface Staff {
    id:         string;
    fullName:   string;
    numControl: string;
    email:      string;
    metrics:    Metrics;
}

export interface Metrics {
    totalAssigned:      number;
    totalResolved:      number;
    pendingTickets:     number;
    effectivenessRate:  number;
    avgResolutionHours: number;
}
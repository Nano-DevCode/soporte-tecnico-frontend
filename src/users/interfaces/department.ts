export interface Department {
    id:       string;
    name:     string;
    priority: string;
    status:   boolean;
}

export type DepartmentResponse = Department[];
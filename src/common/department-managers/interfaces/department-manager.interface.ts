import type { Department } from "@/tickets/interfaces/ticket-details.response";

export interface DepartmentManager {
    id:              string;
    name:            string;
    paternalSurname: string;
    maternalSurname: string;
    department:      Department;
    user:            UserDepartmentManager;
}
export interface UserDepartmentManager {
    id:    string;
    email: string;
    role:  Role;
}

export interface Role {
    name: string;
}

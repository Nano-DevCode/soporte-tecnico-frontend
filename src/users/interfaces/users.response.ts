import type { Department } from "@/Departments/interfaces/department.interface";
import type { Role } from "./roles.response";

export interface UserResponse {
    users: User[];
    meta: Meta;
}

export interface Meta {
    total:    number;
    page:     number;
    lastPage: number;
}


export interface User {
    id:     string;
    email:  string;
    password: string;
    status: boolean;
    role:   Role;
    staff:  Staff;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface Staff {
    id:              string;
    idTelegram:      string;
    name:            string;
    paternalSurname: string;
    maternalSurname: string;
    num_control:     string;
    rfc:             string;
    department:      Department;
    coordination:    Coordination;
    createdAt?: Date;
    updatedAt?: Date;
}

export type CoordinationResponse = Coordination[];


export interface Coordination {
    id:   string;
    name: string;
}

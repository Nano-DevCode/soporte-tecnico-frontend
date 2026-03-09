import type { Department } from "./department";
import type { Rol } from "./roles.response";

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
    status: boolean;
    role:   Rol;
    staff:  Staff;
}

export interface Staff {
    id:              string;
    idTelegram:      string;
    name:            string;
    paternalSurname: string;
    maternalSurname: string;
    num_control:     string;
    department:      Department;
    coordination:    Coordination;
}

export interface Coordination {
    id:   string;
    name: string;
}

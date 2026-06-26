import type { Coordination } from "@/users/interfaces/users.response";

export interface Coordinator {
    id:              string;
    name:            string;
    paternalSurname: string;
    maternalSurname: string;
    user:            User;
    coordination:    Coordination;
}
export interface User {
    id:    string;
    email: string;
    role:  Role;
}

export interface Role {
    name: string;
}

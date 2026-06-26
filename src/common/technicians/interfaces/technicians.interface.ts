export interface Technician {
    id:                 string;
    name:               string;
    paternalSurname:    string;
    maternalSurname:    string;
    num_control:        string;
    assignTicketsCount: number;
    user:               User;
}

export interface User {
    id:    string;
    email: string;
    role:  Role;
}

export interface Role {
    name: string;
}

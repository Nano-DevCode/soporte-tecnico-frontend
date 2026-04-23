export interface Coordinator {
    id:              string;
    name:            string;
    paternalSurname: string;
    maternalSurname: string;
    user:            User;
}
export interface User {
    id:    string;
    email: string;
    role:  Role;
}

export interface Role {
    name: string;
}

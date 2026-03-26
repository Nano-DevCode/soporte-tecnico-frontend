export interface AuthResponse {
    id:     string;
    email:  string;
    status: boolean;
    role:   Role;
    staff:  Staff;
    token:  string;
}

export interface Role {
    id:   string;
    name: UserRole;
}

export type UserRole = 
    | 'SuperAdmin' 
    | 'Jefe CC' 
    | 'Coordinador' 
    | 'Jefe Departamento' 
    | 'Técnico' 
    | 'Planeación' 
    | 'Secretaria CC';

export interface Staff {
    name:            string;
    paternalSurname: string;
    maternalSurname: string;
    department:      Department;
}

export interface Department {
    id:   string;
    name: string;
}
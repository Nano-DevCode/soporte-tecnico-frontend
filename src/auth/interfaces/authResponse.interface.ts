export interface AuthResponse {
    id:    string;
    email: string;
    role:  Role;
    staff: Staff;
    token: string;
    status: boolean;
}

export interface Role {
    name: UserRole;
}

export type UserRole = 'SuperAdmin' | 'Jefe CC' | 'Coordinador' | 'Jefe Departamento' | 'Técnico' | 'Planeación' | 'Secretaria CC';

export interface Staff {
    name:            string;
    paternalSurname: string;
    maternalSurname: string;
}

// 1. Creamos un objeto de JS constante
export const AppRoles = {
    SuperAdmin: 'SuperAdmin',
    JefeCC: 'Jefe CC',
    Coordinador: 'Coordinador',
    JefeDepartamento: 'Jefe Departamento',
    Tecnico: 'Técnico',
    Planeacion: 'Planeación',
    SecretariaCC: 'Secretaria CC',
    Visitante: 'Visitante',
    Inventario: 'Inventario'
} as const;

// 2. Extraemos los tipos de ese objeto para usarlos en nuestras interfaces
// Esto crea un Union Type automático: 'SuperAdmin' | 'Jefe CC' | ...
export type AppRoleType = typeof AppRoles[keyof typeof AppRoles];

export interface AuthResponse {
    id:     string;
    email:  string;
    status: boolean;
    role:   Role;
    staff:  Staff;
    // token:  string;
}

export interface Role {
    id:   string;
    name: AppRoleType; // <-- Usamos el tipo extraído aquí
}

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
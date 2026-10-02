export interface StaffsWithSpecificsRolesResponse {
    staffs: Staff[];
    meta:   Meta;
}

export interface Meta {
    total:      number;
    limit:      number;
    offset:     number;
    totalPages: number;
}

export interface Staff {
    id:              string;
    idTelegram:      null | string;
    name:            string;
    paternalSurname: string;
    maternalSurname: string;
    num_control:     string;
    rfc:             string;
    user:            User;
    fullName:        string;
}

export interface User {
    id:     string;
    email:  string;
    avatar: null;
    status: boolean;
    role:   Role;
}

export interface Role {
    id:   string;
    name: string;
}

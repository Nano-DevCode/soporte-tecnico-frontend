
export interface InfiniteResponseEquipments {
    data: EquipmentItem[];
    meta: Meta;
}

export interface EquipmentItem {
    id:                    string;
    folio:                 string;
    type:                  string;
    departamento:          string;
    model:                 string;
    responsableName:       string;
    status:                boolean;
    processor:             string;
    ram:                   string;
    storage:               string;
    operatingSystem:       string;
    typeEquipmentComputer: string;
}

export interface Meta {
    total:    number;
    page:     number;
    lastPage: number;
}

export interface EquipmentSummary {
    id:              string;
    folio:           string;
    type:            string;
    departamento:    string;
    model:           string;
    responsableName: string;
    status:          boolean;
}


export interface IDResponsable {
    id:          string;
    num_employe: string;
    name:        string;
    first_name:  string;
    last_name:   string;
    area:        string;
    mail:        string;
    created_at:  Date;
    updated_at:  Date;
}

export interface IDTypeEquipment {
    id:         number;
    name:       string;
    created_at: string;
    updated_at: string;
}

export interface IDModel {
    id:         string;
    name:       string;
    created_at: Date;
    updated_at: Date;
}


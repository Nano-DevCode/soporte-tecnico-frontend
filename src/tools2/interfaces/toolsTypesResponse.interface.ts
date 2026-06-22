export interface ToolsTypesResponse {
    toolsTypes: ToolsType[];
    meta:          Meta;
}

export interface ToolsType {
    id:   string;
    name: string;
}

export interface Meta {
    total:    number;
    page:     number;
    lastPage: number;
}

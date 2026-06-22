import type { Brand } from "./toolsBrandsResponse.interfaces";

export interface ToolsModelsResponse {
    toolsModels: Model[];
    meta:   Meta;
}

export interface Meta {
    total:    number;
    page:     number;
    lastPage: number;
}

export interface Model {
    id:    string;
    name:  string;
    brand: Brand;
    createdAt: Date;
    updatedAt: Date;
}

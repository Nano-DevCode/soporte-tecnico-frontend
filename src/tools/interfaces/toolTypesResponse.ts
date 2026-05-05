import type { Meta } from "@/interfaces/meta.interfaces";

export interface ToolTypesResponse {
    types: ToolTypes[];
    meta:   Meta;
}

export interface ToolTypes {
    id:        string;
    name:      string;
    createdAt: Date;
    updatedAt: Date;
}

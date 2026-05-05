import type { Meta } from "@/interfaces/meta.interfaces";
import type { ToolBrand } from "./toolBrandsResponse";

export interface ToolModelsResponse {
    models: ToolModel[];
    meta:   Meta;
}

export interface ToolModel {
    id:        string;
    name:      string;
    brand:   ToolBrand;
    createdAt: Date;
    updatedAt: Date;
}

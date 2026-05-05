import type { Meta } from "@/interfaces/meta.interfaces";

export interface ToolBrandsResponse {
    brands: ToolBrand[];
    meta:   Meta;
}

export interface ToolBrand {
    id:        string;
    name:      string;
    createdAt: Date;
    updatedAt: Date;
}

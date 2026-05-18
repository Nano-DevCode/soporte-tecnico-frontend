import type { Meta } from "@/interfaces/meta.interfaces";
import type { ToolModel } from "./toolModelsResponse";
import type { ToolTypes } from "./toolTypesResponse";

export interface ToolsResponse {
    tools: Tool[];
    meta:   Meta;
}

export interface Tool {
    id:          string;
    idInternal:  string;
    status:      boolean;
    description: string;
    imageUrl:    string | null;
    inUse:       boolean;
    model:       ToolModel;
    type:        ToolTypes;
    createdAt:   Date;
    updatedAt:   Date;
}
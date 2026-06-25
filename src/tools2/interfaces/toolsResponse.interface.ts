import type { Invoice } from "./toolsInvoicesResponse.interface";
import type { Model } from "./toolsModelsResponse.interrface";
import type { ToolsStatus } from "./toolsStatusResponse.interface";
import type { ToolsType } from "./toolsTypesResponse.interface";

export interface ToolsResponse {
    tools: Tool[];
    meta:     Meta;
}

export interface Tool {
    id:            string;
    idInventary:   string;
    status:        boolean;
    inUse:         boolean;
    description:   string;
    imageUrl:      string | null;
    createdAt:     Date;
    updatedAt:     Date;
    model:         Model;
    toolStatus:    ToolsStatus;
    toolType:      ToolsType;
    invoice:       Invoice | null;
}

export interface Meta {
    total:    number;
    page:     number;
    lastPage: number;
}

import type { CenterManager } from "./center-manager.interface";

export interface CenterManagersResponse {
    data: CenterManager[];
    meta: Meta;
}

export interface Meta {
    total:           number;
    limit:           number;
    page:            number;
    totalPages:      number;
    hasNextPage:     boolean;
    hasPreviousPage: boolean;
    lastPage:        number;
}

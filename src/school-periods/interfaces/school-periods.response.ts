import type { SchoolPeriod } from "./school-period.interface";

export interface SchoolPeriodsResponse {
    data: SchoolPeriod[];
    meta: Meta;
}

export interface Meta {
    total: number;
    limit: number;
    page: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    lastPage: number;
}

export interface GetTagsResponse {
    data: Tag[];
    meta: Meta;
}

export interface Tag {
    id:         number;
    name:       string;
    created_at: string;
    updated_at: string;
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

export interface ItAssetsTypesResponse {
    itAssetsTypes: ItAssetsType[];
    meta:          Meta;
}

export interface ItAssetsType {
    id:   string;
    name: string;
}

export interface Meta {
    total:    number;
    page:     number;
    lastPage: number;
}

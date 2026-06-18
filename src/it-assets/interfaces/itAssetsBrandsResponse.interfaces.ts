export interface ItAssetsBrandsResponse {
    itAssetsBrands: Brand[];
    meta:   Meta;
}

export interface Brand {
    id:   string;
    name: string;
}

export interface Meta {
    total:    number;
    page:     number;
    lastPage: number;
}

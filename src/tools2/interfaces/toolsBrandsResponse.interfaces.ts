export interface ToolsBrandsResponse {
    toolsBrands: Brand[];
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

import type { Brand } from "./itAssetsBrandsResponse.interfaces";

export interface ItAssetsModelsResponse {
    models: Model[];
    meta:   Meta;
}

export interface Meta {
    total:    number;
    page:     number;
    lastPage: number;
}

export interface Model {
    id:    string;
    name:  string;
    brand: Brand;
    createdAt: Date;
    updatedAt: Date;
}

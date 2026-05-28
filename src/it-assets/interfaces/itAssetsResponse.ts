export interface ItAssetsResponse {
    itAssets: ItAsset[];
    meta:     Meta;
}

export interface ItAsset {
    id:            string;
    idInventary:   string;
    serialNumber:  string;
    status:        boolean;
    inUse:         boolean;
    description:   string;
    imageUrl:      string | null;
    createdAt:     Date;
    updatedAt:     Date;
    model:         Model;
    itAssetStatus: ItAssetStatus;
    itAssetsType:  ItAssetsType;
    invoice:       Invoice;
}

export interface Invoice {
    id:         string;
    idInternal: string;
    createdAt:  Date;
    updatedAt:  Date;
}

export interface ItAssetStatus {
    id:          string;
    name:        string;
    description: string;
    createdAt:   Date;
    updatedAt:   Date;
}

export interface ItAssetsType {
    id:   string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Model {
    id:    string;
    name:  string;
    brand: ItAssetsType;
    createdAt: Date;
    updatedAt: Date;
}

export interface Meta {
    total:    number;
    page:     number;
    lastPage: number;
}

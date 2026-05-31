import type { Invoice } from "./itAssetsInvoicesResponse.interface";
import type { Model } from "./itAssetsModelsResponse.interrface";
import type { ItAssetsStatus } from "./itAssetsStatusResponse.interface";
import type { ItAssetsType } from "./itAssetsTypesResponse.interface";

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
    itAssetStatus: ItAssetsStatus;
    itAssetsType:  ItAssetsType;
    invoice:       Invoice | null;
}

export interface Meta {
    total:    number;
    page:     number;
    lastPage: number;
}

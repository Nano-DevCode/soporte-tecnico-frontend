import type { ItAsset } from "./itAssetsResponse.interface";
import type { ItAssetsStatus } from "./itAssetsStatusResponse.interface";

export interface ItAssetsMovementIn {
    id:         string;
    createdAt:  Date;
    updatedAt:  Date;
    type:       string;
    itAsset:    ItAsset;
    movementIn: MovementIn;
}

export interface MovementIn {
    id:             string;
    observations:   string;
    itAssetsStatus: ItAssetsStatus;
}

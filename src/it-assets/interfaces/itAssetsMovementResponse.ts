import type { MovementIn } from "./itAssetsMovementInResponse";
import type { MovementOut } from "./itAssetsMovementOutResponse";
import type { ItAsset } from "./itAssetsResponse.interface";

export interface ItAssetsMovementResponse {
    itAssetsMovements: ItAssetsMovement[];
    meta:              Meta;
}

export interface ItAssetsMovement {
    id:          string;
    createdAt:   Date;
    updatedAt:   Date;
    type:        TypeMovement;
    itAsset:     ItAsset;
    movementIn:  MovementIn | null;
    movementOut: MovementOut | null;
}

export const TypeMovement = {
    IN: "IN",
    OUT: "OUT",
} as const;
export type TypeMovement = typeof TypeMovement[keyof typeof TypeMovement];

export interface Meta {
    total:    number;
    page:     number;
    lastPage: number;
}

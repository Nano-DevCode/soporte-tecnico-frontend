import type { MovementIn } from "./toolsMovementInResponse";
import type { MovementOut } from "./toolsMovementOutResponse";
import type { Tool } from "./toolsResponse.interface";

export interface ToolsMovementResponse {
    toolsMovements: ToolsMovement[];
    meta:              Meta;
}

export interface ToolsMovement {
    id:          string;
    createdAt:   Date;
    updatedAt:   Date;
    type:        TypeMovement;
    tool:        Tool;
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

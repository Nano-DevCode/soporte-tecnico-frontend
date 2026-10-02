import type { Tool } from "./toolsResponse.interface";
import type { ToolsStatus } from "./toolsStatusResponse.interface";

export interface ToolsMovementIn {
    id:         string;
    createdAt:  Date;
    updatedAt:  Date;
    tool:       Tool;
    movementIn: MovementIn;
}

export interface MovementIn {
    id:             string;
    observations:   string;
    toolsStatus:    ToolsStatus;
}

import type { Ticket } from "@/tickets/interfaces/ticket.interface";
import type { Tool } from "./toolsResponse.interface";
import type { ToolsStatus } from "./toolsStatusResponse.interface";
import type { Staff } from "./staffsWithSpecificsRolesResponse.interface";

export interface ToolsMovementOut {
    id:          string;
    createdAt:   Date;
    updatedAt:   Date;
    tool:        Tool;
    movementOut: MovementOut;
}

export interface MovementOut {
    id:             string;
    toolStatus: ToolsStatus;
    observations:   string;
    description:    string;
    voucher:        string;
    staff:          Staff;
    ticket:         Ticket;
}

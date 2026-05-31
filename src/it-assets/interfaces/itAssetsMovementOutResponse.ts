import type { Ticket } from "@/tickets/interfaces/ticket.interface";
import type { ItAsset } from "./itAssetsResponse.interface";
import type { ItAssetsStatus } from "./itAssetsStatusResponse.interface";
import type { Staff } from "./staffsWithSpecificsRolesResponse.interface";

export interface ItAssetsMovementOut {
    id:          string;
    createdAt:   Date;
    updatedAt:   Date;
    type:        string;
    itAsset:     ItAsset;
    movementOut: MovementOut;
}

export interface MovementOut {
    id:             string;
    itAssetsStatus: ItAssetsStatus;
    observations:   string;
    description:    string;
    voucher:        string;
    staff:          Staff;
    ticket:         Ticket;
}

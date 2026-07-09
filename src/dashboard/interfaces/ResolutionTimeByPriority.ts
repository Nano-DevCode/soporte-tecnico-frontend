import type { TicketPriorityLevel } from "@/tickets/interfaces/ticket-priority-level.type";

export interface ResolutionTimeData {
    priority: TicketPriorityLevel;
    avg_hours: number;
}

export interface ResolutionTimeResponse {
    success: boolean;
    goals: { [key: string]: number };
    data: ResolutionTimeData[];
}

export interface TransformedResolutionData {
    priorityLabel: string;
    avg_hours: number;
    fill: string;
}

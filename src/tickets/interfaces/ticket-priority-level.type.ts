export const TicketPriorityLevel = {
    CRITIC: 1,
    HIGH: 2,
    MEDIUM: 3,
    LOW: 4
} as const


export type TicketPriorityLevel = typeof TicketPriorityLevel[keyof typeof TicketPriorityLevel];

export type TicketPriorityLevelString = `${TicketPriorityLevel}`;

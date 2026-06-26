export interface CostPerIncident {
    data: {
        success: boolean;
        value: number;
        meta: number;
        details: {
            totalCost: number;
            totalTickets: number;
        };
    };
}
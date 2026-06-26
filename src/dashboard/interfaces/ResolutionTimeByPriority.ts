export interface ResolutionTimeData {
    month: string;
    priority: number;
    avg_hours: number;
}

export interface ResolutionTimeResponse {
    success: boolean;
    data: ResolutionTimeData[];
}
export interface ResolutionTimeData {
    month: string;
    priority: number;
    avg_hours: number;
}

export interface ResolutionTimeResponse {
    success: boolean;
    data: ResolutionTimeData[];
}

export interface TransformedResolutionData {
    month: string;
    [key: `priority_${number}`]: number;
}
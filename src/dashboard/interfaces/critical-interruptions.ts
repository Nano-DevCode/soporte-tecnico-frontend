export interface CriticalInterruptionData {
    month: string;
    count: number;
}

export interface CriticalInterruptionsResponse {
    success: boolean;
    data: CriticalInterruptionData[];
}
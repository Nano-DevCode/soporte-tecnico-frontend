export interface MTTRComparison {
    previousValue: number;
    difference: number;
    isImproved: boolean;
}

export interface MTTRData {
    success: boolean;
    value: number;
    comparison: MTTRComparison;
}

export interface MTTRResponse {
    data: MTTRData;
}
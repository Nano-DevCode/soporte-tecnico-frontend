export interface SlaCompliance {
    data: {
        success: boolean;
        value: number;
        meta: number;
        details: {
            totalResolved: number;
            slaMet: number;
        };
    };
}
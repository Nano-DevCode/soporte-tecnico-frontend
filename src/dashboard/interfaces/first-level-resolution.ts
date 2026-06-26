export interface FirstLevelResolution {
    data: {
        success: boolean;
        value: number;
        meta: number;
        details: {
            totalResolved: number;
            firstLevelResolved: number;
        };
    };
}
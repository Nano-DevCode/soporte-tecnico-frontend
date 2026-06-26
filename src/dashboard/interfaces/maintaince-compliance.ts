export interface MaintenanceCompliance {
    data: {
        success: boolean;
        value: number;
        meta: number;
        details: {
            totalEquipment: number;
            maintainedEquipment: number;
        };
    };
}
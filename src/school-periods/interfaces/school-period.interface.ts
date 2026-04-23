export const PeriodType = {
    ENERO_JUNIO: 'enero-junio',
    VERANO: 'verano',
    AGOSTO_DICIEMBRE: 'agosto-diciembre',
} as const;

export type PeriodType = typeof PeriodType[keyof typeof PeriodType];

export interface SchoolPeriod {
    id: string;
    name: string;
    period_type: PeriodType;
    date_start: Date;
    date_end: Date;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
}

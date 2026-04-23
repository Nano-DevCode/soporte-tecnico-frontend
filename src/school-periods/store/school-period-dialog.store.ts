import { create } from 'zustand';
import type { SchoolPeriod } from '@/school-periods/interfaces/school-period.interface';

export type DialogAction = 'activate' | 'deactivate' | null;

interface SchoolPeriodDialogState {
    selectedSchoolPeriod: SchoolPeriod | null;
    actionType: DialogAction;
    // Acciones
    openDialog: (period: SchoolPeriod, action: DialogAction) => void;
    closeDialog: () => void;
}

export const useSchoolPeriodDialogStore = create<SchoolPeriodDialogState>((set) => ({
    selectedSchoolPeriod: null,
    actionType: null,

    openDialog: (period, action) => set({
        selectedSchoolPeriod: period,
        actionType: action
    }),

    closeDialog: () => set({
        selectedSchoolPeriod: null,
        actionType: null
    }),
}));
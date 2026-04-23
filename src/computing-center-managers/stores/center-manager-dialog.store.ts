import { create } from 'zustand';
import type { CenterManager } from '../interfaces/center-manager.interface';

export type DialogAction = 'activate' | 'deactivate' | null;

interface CenterManagerDialogState {
    selectedCenterManager: CenterManager | null;
    actionType: DialogAction;
    // Acciones
    openDialog: (manager: CenterManager, action: DialogAction) => void;
    closeDialog: () => void;
}

export const useCenterManagerDialogStore = create<CenterManagerDialogState>((set) => ({
    selectedCenterManager: null,
    actionType: null,

    openDialog: (period, action) => set({
        selectedCenterManager: period,
        actionType: action
    }),

    closeDialog: () => set({
        selectedCenterManager: null,
        actionType: null
    }),
}));
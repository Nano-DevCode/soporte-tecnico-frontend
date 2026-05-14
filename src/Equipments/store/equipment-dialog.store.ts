import { create } from 'zustand';
import type { Equipment } from '../interfaces/equipment.interface';

interface EquipmentDialogState {
    selectedEquipment: Equipment | null;
    actionType: 'activate' | 'deactivate' | null;
    openDialog: (equipment: Equipment, type: 'activate' | 'deactivate') => void;
    closeDialog: () => void;
}

export const useEquipmentDialogStore = create<EquipmentDialogState>((set) => ({
    selectedEquipment: null,
    actionType: null,
    openDialog: (equipment, type) => set({ selectedEquipment: equipment, actionType: type }),
    closeDialog: () => set({ selectedEquipment: null, actionType: null }),
}));
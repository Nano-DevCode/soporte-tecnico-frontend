import { useMutation, useQueryClient } from "@tanstack/react-query";
import { activateEquipmentAction, deactivateEquipmentAction } from "../actions/update-status-equipment.action";

export const useEquipmentStatus = () => {
    const queryClient = useQueryClient();

    const activateMutation = useMutation({
        mutationFn: activateEquipmentAction,
        onSuccess: (data) => {
            // 1. Invalida la lista general de equipos
            queryClient.invalidateQueries({ 
                queryKey: ['equipments'] 
            });
            
            // 2. CORRECCIÓN: Invalida el detalle específico de este equipo usando el ID que viene en 'data'
            queryClient.invalidateQueries({
                queryKey: ['equipment', data.id]
            });
        }
    });

    const deactivateMutation = useMutation({
        mutationFn: deactivateEquipmentAction,
        onSuccess: (data) => {
            // 1. Invalida la lista general de equipos
            queryClient.invalidateQueries({ 
                queryKey: ['equipments'] 
            });
            
            // 2. CORRECCIÓN: Lo mismo para la desactivación
            queryClient.invalidateQueries({
                queryKey: ['equipment', data.id]
            });
        }
    });

    return {
        activateMutation,
        deactivateMutation
    };
};

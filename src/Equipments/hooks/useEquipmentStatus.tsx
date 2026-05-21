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

// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { activateEquipmentAction, deactivateEquipmentAction } from "../actions/update-status-equipment.action"; // Las que hicimos antes
// // Importa tus keys de equipos, ej: equipmentKeys
// export const useEquipmentStatus = () => {
//     const queryClient = useQueryClient();

//     const activateMutation = useMutation({
//         mutationFn: activateEquipmentAction,
//         onSuccess: (data) => {
//             // AJUSTE AQUÍ: Invalida todo lo relacionado con 'equipments'
//             // Esto atrapará ['equipments', 'list', {...params}]
//             queryClient.invalidateQueries({ 
//                 queryKey: ['equipments'] 
//             });
            
//             // Esto está bien para el detalle individual
//             queryClient.setQueryData(['equipment', data.id], data);
//         }
//     });

//     const deactivateMutation = useMutation({
//         mutationFn: deactivateEquipmentAction,
//         onSuccess: (data) => {
//             // AJUSTE AQUÍ: Lo mismo para desactivar
//             queryClient.invalidateQueries({ 
//                 queryKey: ['equipments'] 
//             });
            
//             queryClient.setQueryData(['equipment', data.id], data);
//         }
//     });

//     return {
//         activateMutation,
//         deactivateMutation
//     };
// };
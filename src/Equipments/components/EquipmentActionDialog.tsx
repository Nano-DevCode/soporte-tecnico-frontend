import { useEquipmentStatus } from '../hooks/useEquipmentStatus'; // Hook que creamos antes// Debes crear este store
import { useEquipmentDialogStore } from '../store/equipment-dialog.store';

import { getAxiosErrorMessage } from '../../lib/helpers/getAxiosErrorMessage';
import { AlertTriangle, CheckCircle, Dot } from 'lucide-react';
import { CustomDialogConfirm } from '@/components/custom/CustomDialogCorfirm';
import { sileo } from 'sileo';

export const EquipmentActionDialog = () => {
    // Usamos las mutaciones de equipo que configuramos
    const { activateMutation, deactivateMutation } = useEquipmentStatus();
    const { selectedEquipment, actionType, closeDialog } = useEquipmentDialogStore();

    const handleConfirmActivate = () => {
        if (!selectedEquipment) return;
        activateMutation.mutate(selectedEquipment.id, {
            onSuccess: (data) => {
                sileo.success({
                    title: data.message || `El equipo ${selectedEquipment.folio} ha sido activado.`
                });
                closeDialog();
            },
            onError: (error) => {
                sileo.error({
                    title: 'No se pudo activar',
                    description: getAxiosErrorMessage(error)
                });
            }
        });
    };

    const handleConfirmDeactive = () => {
        if (!selectedEquipment) return;
        deactivateMutation.mutate(selectedEquipment.id, {
            onSuccess: (data) => {
                sileo.success({
                    title: data.message || `El equipo ${selectedEquipment.folio} ha sido desactivado.`
                });
                closeDialog();
            },
            onError: (error) => {
                sileo.error({
                    title: 'Error al desactivar',
                    description: getAxiosErrorMessage(error)
                });
            }
        });
    };

    const getDialogConfig = () => {
        const configs = {
            activate: {
                title: "¿Activar este equipo?",
                description: `¿Estás seguro de que deseas activar el equipo con folio ${selectedEquipment?.folio}?`,
                icon: CheckCircle,
                isLoading: activateMutation.isPending,
                onConfirm: handleConfirmActivate,
                variant: 'primary' as const,
            },
            deactivate: {
                title: "¿Desactivar este equipo?",
                description: `¿Estás seguro de que deseas desactivar el equipo con folio ${selectedEquipment?.folio}? Esta acción no eliminará los datos.`,
                icon: AlertTriangle,
                isLoading: deactivateMutation.isPending,
                onConfirm: handleConfirmDeactive,
                variant: 'danger' as const,
            }
        };

        return actionType ? configs[actionType] : {
            title: '',
            description: null,
            icon: Dot,
            isLoading: false,
            onConfirm: () => { },
            variant: 'primary' as const,
        };
    }

    const dialogConfig = getDialogConfig();

    return (
        <CustomDialogConfirm
            open={!!actionType}
            onOpenChange={(isOpen) => !isOpen && closeDialog()}
            title={dialogConfig.title}
            description={dialogConfig.description}
            icon={dialogConfig.icon}
            isLoading={dialogConfig.isLoading}
            onConfirm={dialogConfig.onConfirm}
            variant={dialogConfig.variant}
        />
    );
}
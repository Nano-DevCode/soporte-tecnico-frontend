import { useEquipmentStatus } from '../hooks/useEquipmentStatus';
import { useEquipmentDialogStore } from '../store/equipment-dialog.store';

import { getAxiosErrorMessage } from '../../lib/helpers/getAxiosErrorMessage';
import { AlertTriangle, CheckCircle, Dot } from 'lucide-react';
import { CustomDialogConfirm } from '@/components/custom/CustomDialogCorfirm';
import { sileo } from 'sileo';
import { t } from 'i18next';

export const EquipmentActionDialog = () => {
    // Usamos las mutaciones de equipo que configuramos
    const { activateMutation, deactivateMutation } = useEquipmentStatus();
    const { selectedEquipment, actionType, closeDialog } = useEquipmentDialogStore();

    const handleConfirmActivate = () => {
        if (!selectedEquipment) return;
        activateMutation.mutate(selectedEquipment.id, {
            onSuccess: (data) => {
                sileo.success({
                    title: data.message || `${t("eq_dialog_toast_activate_success_1")} ${selectedEquipment.folio} ${t("eq_dialog_toast_activate_success_2")}`
                });
                closeDialog();
            },
            onError: (error) => {
                sileo.error({
                    title: t("eq_dialog_toast_activate_error"),
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
                    title: data.message || `${t("eq_dialog_toast_deactivate_success_1")} ${selectedEquipment.folio} ${t("eq_dialog_toast_deactivate_success_2")}`
                });
                closeDialog();
            },
            onError: (error) => {
                sileo.error({
                    title: t("eq_dialog_toast_deactivate_error"),
                    description: getAxiosErrorMessage(error)
                });
            }
        });
    };

    const getDialogConfig = () => {
        const configs = {
            activate: {
                title: t("eq_dialog_activate_title"),
                description: `${t("eq_dialog_activate_desc_1")} ${selectedEquipment?.folio || ''}?`,
                icon: CheckCircle,
                isLoading: activateMutation.isPending,
                onConfirm: handleConfirmActivate,
                variant: 'primary' as const,
            },
            deactivate: {
                title: t("eq_dialog_deactivate_title"),
                description: `${t("eq_dialog_deactivate_desc_1")} ${selectedEquipment?.folio || ''}? ${t("eq_dialog_deactivate_desc_2")}`,
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
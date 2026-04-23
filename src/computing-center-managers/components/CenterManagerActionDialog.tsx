import { useTranslation } from 'react-i18next';
import { getAxiosErrorMessage } from '../../lib/helpers/getAxiosErrorMessage';
import { AlertTriangle, CheckCircle, Dot } from 'lucide-react';
import { CustomDialogConfirm } from '@/components/custom/CustomDialogCorfirm';
import { sileo } from 'sileo';
import { useActivateCenterManager } from '../hooks/useActivateCenterManager';
import { useDeactivateCenterManager } from '../hooks/useDeactivateCenterManager';
import { useCenterManagerDialogStore } from '../stores/center-manager-dialog.store';
import { CardCenterManagerInfo } from './CardCenterManagerInfo';
import { getFullName } from '@/users/util/extraUtil';

export const CenterManagerActionDialog = () => {
    const { t } = useTranslation();
    const activateMutation = useActivateCenterManager();
    const deactivateMutation = useDeactivateCenterManager();
    const { selectedCenterManager, actionType, closeDialog } = useCenterManagerDialogStore();

    const fullName = selectedCenterManager
        ? getFullName(selectedCenterManager.names,
            selectedCenterManager.first_last_name,
            selectedCenterManager.second_last_name)
        : '';

    const handleConfirmActivate = () => {
        if (!selectedCenterManager) return;
        activateMutation.mutate(selectedCenterManager.id, {
            onSuccess: () => {
                sileo.success({
                    title: t('center_managers.dialog.active.notifications.success', { name: fullName })
                });
                closeDialog();
            },
            onError: (error) => {
                sileo.error({
                    title: t('common.notifications.error_title'),
                    description: getAxiosErrorMessage(error)
                });
            }
        });
    };

    const handleConfirmDeactivate = () => {
        if (!selectedCenterManager) return;
        deactivateMutation.mutate(selectedCenterManager.id, {
            onSuccess: () => {
                sileo.success({
                    title: t('center_managers.dialog.deactive.notifications.success', { name: fullName })
                });
                closeDialog();
            },
            onError: (error) => {
                sileo.error({
                    title: t('common.notifications.error_title'),
                    description: getAxiosErrorMessage(error)
                });
            }
        });
    };



    const getDialogConfig = () => {
        const configs = {
            activate: {
                title: t('center_managers.dialog.active.title'),
                description: <CardCenterManagerInfo manager={selectedCenterManager} isActivate={true} />,
                icon: CheckCircle,
                isLoading: activateMutation.isPending,
                onConfirm: handleConfirmActivate,
                variant: 'primary' as const,
            },
            deactivate: {
                title: t('center_managers.dialog.deactive.title'),
                description: <CardCenterManagerInfo manager={selectedCenterManager} isActivate={false} />,
                icon: AlertTriangle,
                isLoading: deactivateMutation.isPending,
                onConfirm: handleConfirmDeactivate,
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

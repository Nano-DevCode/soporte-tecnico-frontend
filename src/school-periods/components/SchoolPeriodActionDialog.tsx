import { useTranslation } from 'react-i18next';
import { useSchoolPeriodStatus } from '../hooks/useSchoolPeriodStatus';
import { useSchoolPeriodDialogStore } from '../store/school-period-dialog.store';
import { getAxiosErrorMessage } from '../../lib/helpers/getAxiosErrorMessage';
import { AlertTriangle, CheckCircle, Dot } from 'lucide-react';
import { CustomDialogConfirm } from '@/components/custom/CustomDialogCorfirm';
import { sileo } from 'sileo';
import { CardPeriodInfo } from './CardPeriodInfo';

export const SchoolPeriodActionDialog = () => {
    const { t } = useTranslation();
    const { activateMutation, deactivateMutation } = useSchoolPeriodStatus();
    const { selectedSchoolPeriod, actionType, closeDialog } = useSchoolPeriodDialogStore();

    const handleConfirmActivate = () => {
        // TODO: arreglas las notificaciones
        if (!selectedSchoolPeriod) return;
        activateMutation.mutate(selectedSchoolPeriod.id, {
            onSuccess: () => {
                // toast.success(`El periodo ${selectedSchoolPeriod.name} ha sido activado.`);
                sileo.success({
                    title: `El periodo ${selectedSchoolPeriod.name} ha sido activado.`
                });
                closeDialog();
            },
            onError: (error) => {
                // toast.error('No se pudo activar', { description: getAxiosErrorMessage(error) });
                sileo.error({
                    title: 'No se pudo activar',
                    description: getAxiosErrorMessage(error)
                });
            }
        });
    };

    const handleConfirmDeactive = () => {
        if (!selectedSchoolPeriod) return;
        deactivateMutation.mutate(selectedSchoolPeriod.id, {
            onSuccess: () => {
                sileo.success({
                    title: `El periodo ${selectedSchoolPeriod.name} ha sido desactivado.`
                });
                closeDialog();
            },
            onError: (error) => {
                sileo.error({
                    title: 'Error',
                    description: getAxiosErrorMessage(error)
                });
            }
        });
    };



    const getDialogConfig = () => {
        const configs = {
            activate: {
                title: t('custom_dialog_active_school_period_page_title'),
                description: <CardPeriodInfo period={selectedSchoolPeriod} isActivate={true} />,
                icon: CheckCircle,
                isLoading: activateMutation.isPending,
                onConfirm: handleConfirmActivate,
                variant: 'primary' as const,
            },
            deactivate: {
                title: t('custom_dialog_deactive_school_period_page_title'),
                description: <CardPeriodInfo period={selectedSchoolPeriod} isActivate={false} />,
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

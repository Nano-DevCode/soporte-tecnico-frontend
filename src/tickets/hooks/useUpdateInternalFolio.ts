import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateInternalFolioAction } from '../actions/update-internal-folio.action';
import { isAxiosError } from 'axios';
import { sileo } from 'sileo';
import { useTranslation } from 'react-i18next';
import { ticketsQueryKeys } from '../keys/tickets-query.keys';
import { responsesQueryKeys } from '@/responses/keys/responses-query.keys';

export const useUpdateInternalFolio = () => {
    const queryClient = useQueryClient();
    const { t } = useTranslation();

    return useMutation({
        mutationFn: updateInternalFolioAction,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ticketsQueryKeys.detail(variables.id),
            });
            queryClient.invalidateQueries({
                queryKey: responsesQueryKeys.byTicket(variables.id),
            });
            queryClient.invalidateQueries({
                queryKey: responsesQueryKeys.lists(),
            });

            sileo.success({
                title: t('common.messages.success.title'),
                description: t('folios.responses.update.success'),
            });
        },
        onError: (error) => {
            if (isAxiosError(error)) {
                if (error.response?.status === 409) {
                    sileo.error({
                        title: t('common.messages.error.title'),
                        description: t('errors.tickets.folio_already_exists'),
                    });
                    return;
                }
            }

            sileo.error({
                title: t('common.messages.error.title'),
                description: t('common.messages.error.description'),
            });
        },
    });
};

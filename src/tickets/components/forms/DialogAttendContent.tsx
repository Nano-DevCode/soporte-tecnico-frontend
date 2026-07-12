import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { type TicketActionsType } from '@/tickets/utils/ticket-state-machine';
import { ACTION_UI_CONFIG } from '@/tickets/utils/action-ui-config';

interface Props {
    eventToConfirm: TicketActionsType | null;
    setEventToConfirm: (value: TicketActionsType | null) => void
    onDirectAction: (event: TicketActionsType) => void;
}

export const DialogAttendForm = ({ eventToConfirm, setEventToConfirm, onDirectAction }: Props) => {
    const { t } = useTranslation();

    const currentConfig = eventToConfirm ? ACTION_UI_CONFIG[eventToConfirm] : null;
    const titleKey = currentConfig?.confirmTitle;
    const messageKey = currentConfig?.confirmMessage;

    const handleStandardConfirm = () => {
        if (eventToConfirm) {
            onDirectAction(eventToConfirm);
        }
        setEventToConfirm(null);
    };


    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>
                    {titleKey ? t(titleKey) : null}
                </DialogTitle>
                <DialogDescription>
                    {messageKey ? t(messageKey) : null}
                </DialogDescription>
            </DialogHeader>
            <DialogFooter>
                <Button variant="secondary" onClick={() => setEventToConfirm(null)}>
                    {t('common.buttons.cancel')}
                </Button>

                <Button onClick={handleStandardConfirm}>
                    {t('common.buttons.continue')}
                </Button>
            </DialogFooter>
        </DialogContent>
    )
}
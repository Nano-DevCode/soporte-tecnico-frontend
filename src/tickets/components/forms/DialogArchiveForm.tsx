import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { TicketDocumentButton } from '../details/TicketDocumentButton';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { TicketActions, type TicketActionsType } from '@/tickets/utils/ticket-state-machine';
import { TYPE_DOCUMENT_NAME, type Document } from '@/tickets/interfaces/ticket-details.response';
import { ACTION_UI_CONFIG } from '@/tickets/utils/action-ui-config';

interface Props {
    eventToConfirm: TicketActionsType | null;
    documents?: Document[];
    setEventToConfirm: (value: TicketActionsType | null) => void
    onDirectAction: (event: TicketActionsType) => void;
}

export const DialogArchiveForm = ({ eventToConfirm, documents, setEventToConfirm, onDirectAction }: Props) => {
    const { t } = useTranslation();

    const requestDocument = documents?.find((doc) => doc.type_document.name === TYPE_DOCUMENT_NAME.SERVICE_REQUEST_FORM);
    const responseDocument = documents?.find((doc) => doc.type_document.name === TYPE_DOCUMENT_NAME.WORK_ORDER_FORM);

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
            <div className="py-2 space-y-2">
                {responseDocument && (
                    <TicketDocumentButton
                        documentType={TYPE_DOCUMENT_NAME.WORK_ORDER_FORM}
                        filename={responseDocument.name}
                        className="w-full justify-start"
                    />
                )}

                {eventToConfirm === TicketActions.ARCHIVAR && requestDocument && (
                    <TicketDocumentButton
                        documentType={TYPE_DOCUMENT_NAME.SERVICE_REQUEST_FORM}
                        filename={requestDocument.name}
                        className="w-full justify-start"
                    />
                )}
            </div>
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

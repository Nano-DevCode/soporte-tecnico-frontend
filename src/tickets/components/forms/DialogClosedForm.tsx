import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { TicketDocumentButton } from '../details/TicketDocumentButton';
import { SatisfactionSurvey } from '@/questionnaire/components/SurveyDialog';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { type TicketActionsType } from '@/tickets/utils/ticket-state-machine';
import { TYPE_DOCUMENT_NAME, type Document } from '@/tickets/interfaces/ticket-details.response';
import { ACTION_UI_CONFIG } from '@/tickets/utils/action-ui-config';
import { useActiveQuestions } from '@/questionnaire/hooks/useActiveQuestions';
import { Loader2 } from 'lucide-react';
import { sileo } from 'sileo';
import { useEffect, useState } from 'react';
import type { SubmitSurveyPayload } from '@/tickets/schemas/createSurveySchema';

interface Props {
    eventToConfirm: TicketActionsType | null;
    documents?: Document[];
    setEventToConfirm: (value: TicketActionsType | null) => void
    onDirectAction: (event: TicketActionsType, payload?: SubmitSurveyPayload) => void;
}

export const DialogClosedForm = ({ eventToConfirm, documents, setEventToConfirm, onDirectAction }: Props) => {
    const { t } = useTranslation();
    const { data, isLoading, isError } = useActiveQuestions()
    const [isSurveyValid, setIsSurveyValid] = useState(false);

    const responseDocument = documents?.find((doc) => doc.type_document.name === TYPE_DOCUMENT_NAME.WORK_ORDER_FORM);

    const currentConfig = eventToConfirm ? ACTION_UI_CONFIG[eventToConfirm] : null;
    const titleKey = currentConfig?.confirmTitle;
    const messageKey = currentConfig?.confirmMessage;

    const shouldAbort = isError || !data || !responseDocument;
    useEffect(() => {
        if (shouldAbort && !isLoading) {
            sileo.error({
                description: t('common.fetch_error.description'),
                title: t('common.fetch_error.title')
            });
            setEventToConfirm(null);
        }
    }, [shouldAbort, isLoading, t, setEventToConfirm]);

    const handleSurveySubmit = (answersPayload: SubmitSurveyPayload) => {
        if (eventToConfirm) {
            onDirectAction(eventToConfirm, answersPayload);
        }
        setEventToConfirm(null);
    };

    if (isLoading) {
        return (
            <DialogContent className="flex justify-center items-center h-40">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </DialogContent>
        );
    }

    if (shouldAbort) return null

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
                <TicketDocumentButton
                    documentType={TYPE_DOCUMENT_NAME.WORK_ORDER_FORM}
                    filename={responseDocument.name}
                    className="w-full justify-start"
                />
            </div>

            <SatisfactionSurvey
                questions={data}
                onSubmit={handleSurveySubmit}
                onValidationChange={setIsSurveyValid}
            />
            <DialogFooter>
                <Button variant="secondary" onClick={() => setEventToConfirm(null)}>
                    {t('common.buttons.cancel')}
                </Button>

                <Button
                    type="submit"
                    form="close-ticket-survey-form"
                    disabled={!isSurveyValid || data.length === 0}
                >
                    {t('common.buttons.continue')}
                </Button>
            </DialogFooter>
        </DialogContent>
    )
}

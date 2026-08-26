import { Button } from "@/components/ui/button";
import { FileText, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useGetTicketPdf } from "@/tickets/hooks/useGetTicketPdf";
import { useGetTicketResponsePdf } from "@/tickets/hooks/useGetTicketResponsePdf";
import { TYPE_DOCUMENT_NAME } from "@/tickets/interfaces/ticket-details.response";
import { useCan } from "@/common/permission/useCan";
import { useRegenerateTicketPdf } from "@/tickets/hooks/useRegenerateTicketPdf";
import { RefreshCcw } from "lucide-react";

interface TicketDocumentButtonProps {
    documentType: TYPE_DOCUMENT_NAME;
    filename: string;
    ticketId?: string;
    withTitle?: boolean;
    className?: string;
}

export const TicketDocumentButton = ({ documentType, filename, ticketId, className, withTitle }: TicketDocumentButtonProps) => {
    const { t } = useTranslation();
    const { can } = useCan();

    const { mutate: openRequestPdf, isPending: isPendingRequest } = useGetTicketPdf();
    const { mutate: openResponsePdf, isPending: isPendingResponse } = useGetTicketResponsePdf();
    const { mutate: regeneratePdf, isPending: isRegenerating } = useRegenerateTicketPdf();

    const isRequest = documentType === TYPE_DOCUMENT_NAME.SERVICE_REQUEST_FORM;
    const isResponse = documentType === TYPE_DOCUMENT_NAME.WORK_ORDER_FORM;

    const hasPermission = isRequest
        ? can('WATCH_TICKET')
        : isResponse
            ? can('WATCH_RESPONSE_REPORT')
            : false;

    if (!hasPermission) return null;

    const handleOpenDocument = () => {
        if (isRequest) openRequestPdf(filename);
        if (isResponse) openResponsePdf(filename);
    };

    const isPending = isRequest ? isPendingRequest : isPendingResponse;
    const buttonLabel = isRequest
        ? t('tickets.documents.request_pdf')
        : t('tickets.documents.work_order_pdf');

    const handleRegenerate = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (ticketId) {
            regeneratePdf({ ticketId, type: isRequest ? 'request' : 'response' });
        }
    };

    return (
        <div className="flex items-center gap-1">
            <Button
                variant="outline"
                className={`gap-2 ${className || ''}`}
                onClick={handleOpenDocument}
                disabled={isPending || isRegenerating}
                title="Abrir PDF"
            >
                {isPending ? (
                    <Loader2 className="animate-spin text-muted-foreground" />
                ) : (
                    <FileText className="text-amber-700" />
                )}
                {withTitle === undefined || withTitle === true ? buttonLabel : null}
            </Button>

            {can('REGENERATE_TICKET_DOCUMENTS') && ticketId && (
                <Button
                    variant="outline"
                    size="icon"
                    onClick={handleRegenerate}
                    disabled={isRegenerating || isPending}
                    title="Regenerar PDF"
                >
                    <RefreshCcw className={`h-4 w-4 ${isRegenerating ? 'animate-spin' : ''}`} />
                </Button>
            )}
        </div>
    );
};
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Loader2, FileDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { CustomHeaderCard } from "@/components/custom/CustomHeaderCard";
import type { TicketStatusCode } from "../../interfaces/ticket-status-code.interface";
// Asumiendo que guardaste el hook que creamos en esta ruta:
import { Separator } from "@/components/ui/separator";
import { useGetTicketPdf } from "@/tickets/hooks/useGetTicketPdf";
import { TYPE_DOCUMENT_NAME, type Document } from "@/tickets/interfaces/ticket-details.response";
import { useGetTicketResponsePdf } from "@/tickets/hooks/useGetTicketResponsePdf";

interface Props {
    ticketId: string;
    currentState: TicketStatusCode;
    documents: Document[];
}

export const TicketDocuments = ({ currentState, documents }: Props) => {
    const { t } = useTranslation();
    const { mutate: openRequestPdf, isPending: isPendingRequest } = useGetTicketPdf();
    const { mutate: openResponsePdf, isPending: isPendingResponse } = useGetTicketResponsePdf();

    const handleOpenDocument = (documentType: TYPE_DOCUMENT_NAME) => {
        const filename = documents.find((doc) =>
            doc.type_document.name === documentType)?.name ?? undefined

        if (filename && documentType === TYPE_DOCUMENT_NAME.SERVICE_REQUEST_FORM) {
            openRequestPdf(filename);
        }
        else if (filename && documentType === TYPE_DOCUMENT_NAME.WORK_ORDER_FORM) {
            openResponsePdf(filename);
        }
    };

    return (
        <Card>
            <CardHeader className="gap-0">
                <CustomHeaderCard
                    title={t('tickets.documents.title', 'Documentos')}
                    description={t('tickets.documents.description', 'Archivos y formatos generados de esta solicitud.')}
                    icon={FileDown}
                />
            </CardHeader>
            <Separator />
            <CardContent className="space-y-3">
                <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => handleOpenDocument(TYPE_DOCUMENT_NAME.SERVICE_REQUEST_FORM)}
                    disabled={isPendingRequest}
                >
                    {isPendingRequest
                        ? <Loader2 className="animate-spin text-muted-foreground" />
                        : <FileText className="text-amber-700" />}
                    {t('tickets.documents.request_pdf', 'Formato de Solicitud de Mantenimiento')}
                </Button>

                {(currentState === 'FINALIZADA' || currentState === 'CERRADA' || currentState === 'ARCHIVADA') && (
                    <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => handleOpenDocument(TYPE_DOCUMENT_NAME.WORK_ORDER_FORM)}
                        disabled={isPendingResponse}
                    >
                        {isPendingResponse
                            ? <Loader2 className="animate-spin text-muted-foreground" />
                            : <FileText className="text-amber-700" />}
                        {t('tickets.documents.work_order_pdf', 'Orden de Trabajo (Reporte Final)')}
                    </Button>
                )}
            </CardContent>
        </Card>
    );
};
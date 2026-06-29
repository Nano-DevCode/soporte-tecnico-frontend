import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Loader2, FileDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { CustomHeaderCard } from "@/components/custom/CustomHeaderCard";
import { Separator } from "@/components/ui/separator";
import { useGetTicketPdf } from "@/tickets/hooks/useGetTicketPdf";
import { TYPE_DOCUMENT_NAME, type Document } from "@/tickets/interfaces/ticket-details.response";
import { useGetTicketResponsePdf } from "@/tickets/hooks/useGetTicketResponsePdf";
import { useCan } from "@/common/permission/useCan";

interface Props {
    documents: Document[];
}

export const TicketDocuments = ({ documents }: Props) => {
    const { t } = useTranslation();
    const { can } = useCan();
    const { mutate: openRequestPdf, isPending: isPendingRequest } = useGetTicketPdf();
    const { mutate: openResponsePdf, isPending: isPendingResponse } = useGetTicketResponsePdf();

    const requestDocument = documents?.find((doc) => doc.type_document.name === TYPE_DOCUMENT_NAME.SERVICE_REQUEST_FORM);
    const responseDocument = documents?.find((doc) => doc.type_document.name === TYPE_DOCUMENT_NAME.WORK_ORDER_FORM);

    const showRequest = requestDocument && can('WATCH_TICKET');
    const showResponse = responseDocument && can('WATCH_RESPONSE_REPORT');

    const handleOpenDocument = (filename: string, documentType: TYPE_DOCUMENT_NAME) => {
        if (documentType === TYPE_DOCUMENT_NAME.SERVICE_REQUEST_FORM) {
            openRequestPdf(filename
                // ,{
                // onError: (error) => {
                //     sileo.error({
                //         title: t('tickets.documents.errors.title'),
                //         description: getAxiosErrorMessage(error) || t('tickets.documents.errors.loading_request'),
                //     });
                // }
                // }
            );
        }
        else if (documentType === TYPE_DOCUMENT_NAME.WORK_ORDER_FORM) {
            openResponsePdf(filename
                //     , {
                //     onError: (error) => {
                //         sileo.error({
                //             title: t('tickets.documents.errors.title'),
                //             description: getAxiosErrorMessage(error) || t('tickets.documents.errors.loading_response'),
                //         });
                //     }
                // }
            );
        }
    };

    if (!showRequest && !showResponse) return null;

    return (
        <Card>
            <CardHeader className="gap-0">
                <CustomHeaderCard
                    title={t('tickets.view_page.documents.title')}
                    description={t('tickets.view_page.documents.description')}
                    icon={FileDown}
                />
            </CardHeader>
            <Separator />
            <CardContent className="space-y-3">
                {showRequest && (
                    <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => handleOpenDocument(requestDocument!.name, TYPE_DOCUMENT_NAME.SERVICE_REQUEST_FORM)}
                        disabled={isPendingRequest}
                    >
                        {isPendingRequest
                            ? <Loader2 className="animate-spin text-muted-foreground" />
                            : <FileText className="text-amber-700" />}
                        {t('tickets.documents.request_pdf')}
                    </Button>
                )}

                {showResponse && (
                    <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => handleOpenDocument(responseDocument!.name, TYPE_DOCUMENT_NAME.WORK_ORDER_FORM)}
                        disabled={isPendingResponse}
                    >
                        {isPendingResponse
                            ? <Loader2 className="animate-spin text-muted-foreground" />
                            : <FileText className="text-amber-700" />}
                        {t('tickets.documents.work_order_pdf')}
                    </Button>
                )}
            </CardContent>
        </Card>
    );
};
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { FileDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { CustomHeaderCard } from "@/components/custom/CustomHeaderCard";
import { Separator } from "@/components/ui/separator";
import { TYPE_DOCUMENT_NAME, type Document } from "@/tickets/interfaces/ticket-details.response";
import { TicketDocumentButton } from "./TicketDocumentButton";

interface Props {
    documents: Document[];
}

export const TicketDocuments = ({ documents }: Props) => {
    const { t } = useTranslation();

    const requestDocument = documents?.find((doc) => doc.type_document.name === TYPE_DOCUMENT_NAME.SERVICE_REQUEST_FORM);
    const responseDocument = documents?.find((doc) => doc.type_document.name === TYPE_DOCUMENT_NAME.WORK_ORDER_FORM);

    if (!requestDocument && !responseDocument) return null;

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
                {requestDocument && (
                    <TicketDocumentButton
                        documentType={TYPE_DOCUMENT_NAME.SERVICE_REQUEST_FORM}
                        filename={requestDocument.name}
                        className="w-full justify-start"
                    />
                )}

                {responseDocument && (
                    <TicketDocumentButton
                        documentType={TYPE_DOCUMENT_NAME.WORK_ORDER_FORM}
                        filename={responseDocument.name}
                        className="w-full justify-start"
                    />
                )}
            </CardContent>
        </Card>
    );
};
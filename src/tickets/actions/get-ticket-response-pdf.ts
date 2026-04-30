import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";

export const getTicketResponsePdfAction = async (filename: string): Promise<Blob> => {
    const { data } = await soporteTecnicoApi.get<Blob>(`/files/pdfs-response/${filename}`, {
        responseType: 'blob',
    });

    return data;
};
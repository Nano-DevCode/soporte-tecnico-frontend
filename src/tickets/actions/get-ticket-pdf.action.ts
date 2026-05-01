import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";

export const getTicketPdfAction = async (filename: string): Promise<Blob> => {
    const { data } = await soporteTecnicoApi.get<Blob>(`/files/pdfs-request/${filename}`, {
        responseType: 'blob',
    });

    return data;
};
import type { PaginatedQuestionsResponse } from '../interfaces/all-questions.interface';
import { soporteTecnicoApi } from '@/api/soporteTecnicoApi';

export interface FilterQuestionsParams {
    page?: number;
    limit?: number;
    search?: string;
    is_active?: boolean;
}

export const getAllQuestionsAction = async (
    params: FilterQuestionsParams,
): Promise<PaginatedQuestionsResponse> => {

    const { data } = await soporteTecnicoApi.get<PaginatedQuestionsResponse>(`/survey/admin/questions`, {
        params: params,
    });

    return data;
};
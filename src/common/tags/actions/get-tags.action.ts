import { soporteTecnicoApi } from "@/api/soporteTecnicoApi"
import type { GetTagsResponse } from "../interfaces/tag.interface";

interface FetchTagsParams {
    search?: string;
    page?: number;
    limit?: number;
}

export const getTagsAction = async (params: FetchTagsParams): Promise<GetTagsResponse> => {
    const { data } = await soporteTecnicoApi.get<GetTagsResponse>('/tags',
        { params }
    );
    return data;
}
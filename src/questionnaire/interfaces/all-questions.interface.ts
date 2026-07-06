import type { MetaExtended } from "@/common/interafaces/meta-paginated-extended.interface";

export type QuestionTypeOptions = 'RATING' | 'TEXT'

export interface SurveyQuestion {
    id: string;
    questionText: string;
    type: QuestionTypeOptions;
    isActive: boolean;
    createdAt: string;
}

export interface PaginatedQuestionsResponse {
    data: SurveyQuestion[];
    meta: MetaExtended
}
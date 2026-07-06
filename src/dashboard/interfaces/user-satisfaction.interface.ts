export interface QuestionBreakdown {
    questionId: string;
    questionText: string;
    average: number;
    totalResponses: number;
}

export interface UserSatisfactionDetails {
    averageScore: number;
    totalSurveys: number;
    questionBreakdown: QuestionBreakdown[];
}

export interface UserSatisfactionData {
    success: boolean;
    value: number; // Porcentaje CSAT
    meta: number;
    details: UserSatisfactionDetails;
}

export interface UserSatisfactionResponse {
    data: UserSatisfactionData;
}
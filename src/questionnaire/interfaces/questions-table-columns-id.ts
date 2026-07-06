export const QUESTIONS_TABLE_COLUMN_ID = {
    QUESTION: "question",
    TYPE: "type",
    STATUS: "status",
    ACTIONS: "actions",
} as const;

export type QuestionsTableColumnId = typeof QUESTIONS_TABLE_COLUMN_ID[keyof typeof QUESTIONS_TABLE_COLUMN_ID];
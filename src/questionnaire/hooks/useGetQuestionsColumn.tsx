// columns.tsx
"use client"

import type { ColumnDef } from "@tanstack/react-table"
import type { TFunction } from "i18next"

import '@tanstack/react-table'
import { QUESTIONS_TABLE_COLUMN_ID } from "../interfaces/questions-table-columns-id"
import type { SurveyQuestion } from "../interfaces/all-questions.interface"
import { CustomIsActiveBadge } from "@/components/custom/CustomIsActiveBadge"
import { QuestionActionsCell } from "../components/QuestionActionsCell"


export const getTableQuestionsColumns = (
    t: TFunction
): ColumnDef<SurveyQuestion>[] => {
    return [
        {
            accessorKey: "questionText",
            id: QUESTIONS_TABLE_COLUMN_ID.QUESTION,
            header: t("surveys.questions.data.question"),
            cell: ({ row }) => (
                row.original.questionText
            ),
        },
        {
            accessorKey: "type",
            id: QUESTIONS_TABLE_COLUMN_ID.TYPE,
            header: t("surveys.questions.data.type"),
            cell: ({ row }) => (
                t(`surveys.questions.data.type_options.${row.original.type}`)
            ),
        },
        {
            accessorKey: "isActive",
            id: QUESTIONS_TABLE_COLUMN_ID.STATUS,
            header: t("surveys.questions.data.status"),
            cell: ({ row }) => (
                <CustomIsActiveBadge isActive={row.original.isActive} />
            ),
        },
        {
            id: QUESTIONS_TABLE_COLUMN_ID.ACTIONS,
            enableSorting: false,
            header: t("surveys.questions.data.actions"),
            cell: ({ row }) => (
                <QuestionActionsCell
                    question={row.original}
                />
            ),
        },
    ]
}
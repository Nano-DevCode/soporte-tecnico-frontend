import { SuspenseWrapper } from "@/components/custom/SuspenseWrapper";
import { useRoutes } from "react-router";
import { CanRoute } from "@/common/permission/CanRoute";
import { lazy } from "react";

const ListQuestionsPage = lazy(() => import("./pages/ListQuestionsPage").then(module => ({ default: module.ListQuestionsPage })));
const CreateQuestionPage = lazy(() => import("./pages/CreateQuestionPage").then(module => ({ default: module.CreateQuestionPage })));
const EditQuestionPage = lazy(() => import("./pages/EditQuestionPage").then(module => ({ default: module.EditQuestionPage })));

export const QuestionnaireRoutes = () => {
    return useRoutes([
        {
            index: true,
            path: 'questions',
            element: (
                <SuspenseWrapper>
                    <CanRoute permission={'WATCH_QUESTIONS_LIST'}>
                        <ListQuestionsPage />
                    </CanRoute>
                </SuspenseWrapper>
            )
        },
        {
            path: 'questions/new',
            element: (
                <SuspenseWrapper>
                    <CanRoute permission={'CREATE_QUESTION'}>
                        <CreateQuestionPage />
                    </CanRoute>
                </SuspenseWrapper>
            )
        },
        {
            path: 'questions/:id/edit',
            element: (
                <SuspenseWrapper>
                    <CanRoute permission={'EDIT_QUESTION'}>
                        <EditQuestionPage />
                    </CanRoute>
                </SuspenseWrapper>
            )
        },
    ]);
};
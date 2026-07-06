import { SuspenseWrapper } from "@/components/custom/SuspenseWrapper";
import { useRoutes } from "react-router";
import { ListQuestionsPage } from "./pages/ListQuestionsPage";
import { CreateQuestionPage } from "./pages/CreateQuestionPage";
import { CanRoute } from "@/common/permission/CanRoute";
import { EditQuestionPage } from "./pages/EditQuestionPage";

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
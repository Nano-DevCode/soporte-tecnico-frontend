import { HelpCircle, Plus } from "lucide-react";
import { CustomTitleCard } from "@/components/custom/CustomTitleCard";
import { useTranslation } from "react-i18next";
import { Can } from "@/common/permission/Can";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { QuestionsTable } from "../components/QuestionsTable";

export function ListQuestionsPage() {

    const { t } = useTranslation();

    return (
        <>
            <CustomTitleCard
                icon={HelpCircle}
                title={t("surveys.questions.list_page.title")}
                description={t("surveys.questions.list_page.description")}
            />
            <div className="space-y-3 md:space-y-6">


                <div className="ml-auto flex flex-wrap gap-2 justify-end">
                    <Can permission={"CREATE_QUESTION"} >
                        <Link to="/survey/questions/new">
                            <Button>
                                <Plus className="h-4 w-4" />
                                {t("surveys.questions.list_page.actions.new")}
                            </Button>
                        </Link>
                    </Can >
                </div>

                <QuestionsTable />
            </div >
        </>
    );
}
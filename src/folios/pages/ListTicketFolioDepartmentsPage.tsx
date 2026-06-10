import { CustomTitleCard } from "@/components/custom/CustomTitleCard";
import { FileDigit } from "lucide-react";
import { useTranslation } from "react-i18next"
import { ListTicketFolioDepartments } from "../components/ListTicketFolioDepartments";

export const ListTicketFolioDepartmentsPage = () => {
    const { t } = useTranslation();

    return (
        <>
            <CustomTitleCard
                icon={FileDigit}
                title={t("folios.list_page.title")}
                description={t("folios.list_page.description")} />

            <div className="space-y-3 md:space-y-6">

                <ListTicketFolioDepartments />
            </div >
        </>
    )
}

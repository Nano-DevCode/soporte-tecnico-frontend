import { Archive } from "lucide-react";
import { CustomTitleCard } from "@/components/custom/CustomTitleCard";
import { useTranslation } from "react-i18next";
import { CustomArchiveTicketList } from "../components/CustomArchiveTicketList";

export function ListArchiveTicketsPage() {

    const { t } = useTranslation();

    return (
        <>
            <CustomTitleCard
                icon={Archive}
                title={t("tickets.list_archive_page.title")}
                description={t("tickets.list_archive_page.description")}
            />

            <div className="space-y-3 md:space-y-6">
                <CustomArchiveTicketList />
            </div >
        </>
    );
}
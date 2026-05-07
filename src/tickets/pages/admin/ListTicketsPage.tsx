import { ShieldUser } from "lucide-react";
import { CustomTitleCard } from "@/components/custom/CustomTitleCard";
import { useTranslation } from "react-i18next";
import { CustomCreateButtonElement } from "@/components/custom/CustomCreateButtonElement";
import { CustomListTickets } from "@/tickets/components/CustomListTickets";
import { Can } from "@/common/permission/Can";

export function ListTicketPage() {

  const { t } = useTranslation();

  // TODO: agregar dialogs si es necesario
  // TODO: agregar los filtros
  return (
    <div className="space-y-3 md:space-y-6">

      {/* <CenterManagerActionDialog /> */}

      <CustomTitleCard icon={ShieldUser}
        title={t("tickets.list_page.title")}
        description={t("tickets.list_page.description")} />

      <Can permission={"CREATE_TICKET"} >
        <div className="flex flex-col items-end">
          <CustomCreateButtonElement
            label={t("tickets.list_page.actions.new")}
            to="/tickets/new"
          />
        </div>
      </Can>

      {/* <CustomFilterCenterManagers /> */}

      <CustomListTickets />
    </div>
  );
}
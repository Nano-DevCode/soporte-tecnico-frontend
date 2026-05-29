import { Plus, ShieldUser } from "lucide-react";
import { CustomTitleCard } from "@/components/custom/CustomTitleCard";
import { useTranslation } from "react-i18next";
import { CustomListTickets } from "@/tickets/components/CustomListTickets";
import { Can } from "@/common/permission/Can";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";

export function ListTicketPage() {

  const { t } = useTranslation();

  return (
    <>
      <CustomTitleCard icon={ShieldUser}
        title={t("tickets.list_page.title")}
        description={t("tickets.list_page.description")} />
      <div className="space-y-3 md:space-y-6">


        <Can permission={"CREATE_TICKET"} >
          <div className="flex justify-end">
            <Link to="/tickets/new">
              <Button>
                <Plus className="h-4 w-4" />
                {t("tickets.list_page.actions.new")}

              </Button>
            </Link>
          </div>
        </Can >

        <CustomListTickets />
      </div >
    </>
  );
}
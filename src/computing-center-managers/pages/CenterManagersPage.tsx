import { ShieldUser } from "lucide-react";
import { CustomTitleCard } from "@/components/custom/CustomTitleCard";
import { useTranslation } from "react-i18next";
import { CustomCreateButtonElement } from "@/components/custom/CustomCreateButtonElement";
import { CustomFilterCenterManagers } from "../components/CustomFilterCenterManagers";
import { CustomListCenterManagers } from "../components/CustomListCenterManagers";
import { CenterManagerActionDialog } from "../components/CenterManagerActionDialog";
import { Can } from "@/common/permission/Can";

export function CenterManagersPage() {

  const { t } = useTranslation();


  return (
    <div className="space-y-3 md:space-y-6">

      <CenterManagerActionDialog />

      <CustomTitleCard icon={ShieldUser}
        title={t("center_managers.list_page.title")}
        description={t("center_managers.list_page.title")} />

      <div className="flex flex-col items-end">
        <Can permission="CREATE_MANAGER">
          <CustomCreateButtonElement
            label={t("center_managers.list_page.actions.new")}
            to="/center-managers/new"
          />
        </Can>
      </div>

      <CustomFilterCenterManagers />

      <CustomListCenterManagers />
    </div>
  );
}
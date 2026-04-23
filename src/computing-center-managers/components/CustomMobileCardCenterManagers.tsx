import { useTranslation } from "react-i18next";
import type { CenterManager } from "../interfaces/center-manager.interface";
import { CustomActionsMenuCenterManagers } from "./CustomActionsMenuCenterManager";
import { IdCard, User, UserX } from "lucide-react";
import { getFullName } from "@/users/util/extraUtil";
import { CustomIsActiveBadge } from "@/components/custom/CustomIsActiveBadge";
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item";
import { Badge } from "@/components/ui/badge";
import { CustomEmptyListState } from "@/components/custom/CustomEmptyListState";

interface Props {
  centerManagers: CenterManager[];
  handleActivateClick: (centerManager: CenterManager) => void;
  handleDeactivateClick: (centerManager: CenterManager) => void;
  handleCardClick: (id: string) => void;
}

export const CustomMobilCardCenterManagers = (
  { centerManagers, handleActivateClick, handleDeactivateClick, handleCardClick }: Props
) => {

  const { t } = useTranslation()

  return (
    <div className="space-y-3">
      {centerManagers.map((centerManager) => {
        const fullName = getFullName(
          centerManager.names,
          centerManager.first_last_name,
          centerManager.second_last_name
        )

        return (
          <Item
            variant='muted'
            key={centerManager.id}
            role="button"
            tabIndex={0}
            className="cursor-pointer transition-all active:scale-[0.98] hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            onClick={() => handleCardClick(centerManager.id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleCardClick(centerManager.id);
              }
            }}
          >
            <ItemMedia className="h-10 w-10 rounded-full bg-primary/10 ">
              <User className="h-5 w-5" />
            </ItemMedia>

            <ItemContent>
              <ItemTitle className="truncate">
                {fullName}
              </ItemTitle>

              <ItemDescription className="flex flex-wrap gap-2">
                <Badge variant="secondary">
                  <IdCard />
                  <span className="font-mono font-medium tracking-wide">
                    {centerManager.rfc}
                  </span>
                </Badge>

                <CustomIsActiveBadge isActive={centerManager.is_active} />
              </ItemDescription>
            </ItemContent>

            <ItemActions className="shrink-0">
              <div onClick={(e) => e.stopPropagation()}>
                <CustomActionsMenuCenterManagers
                  centerManager={centerManager}
                  handleActivateClick={handleActivateClick}
                  handleDeactivateClick={handleDeactivateClick}
                />
              </div>
            </ItemActions>
          </Item>
        );
      })}

      {centerManagers.length === 0 && (

        <Item variant='muted'>
          <CustomEmptyListState
            icon={UserX}
            title={t("center_managers.list_page.empty.title")}
            description={t("center_managers.list_page.empty.description")}
          />
        </Item>
      )}
    </div>
  )
}
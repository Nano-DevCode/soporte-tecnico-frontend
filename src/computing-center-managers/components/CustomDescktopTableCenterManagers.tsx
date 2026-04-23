import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UserX } from "lucide-react";
import { useTranslation } from 'react-i18next';
import type { CenterManager } from "../interfaces/center-manager.interface";
import { CustomActionsMenuCenterManagers } from "./CustomActionsMenuCenterManager";
import { getFullName } from "@/users/util/extraUtil";
import { CustomIsActiveBadge } from "@/components/custom/CustomIsActiveBadge";
import { CustomEmptyListState } from "@/components/custom/CustomEmptyListState";

interface Props {
  centerManagers: CenterManager[];
  handleActivateClick: (centerManager: CenterManager) => void;
  handleDeactivateClick: (centerManager: CenterManager) => void;
  handleRowClick: (id: string) => void;
}

export const CustomDesktopTableCenterManagers = (
  { centerManagers, handleActivateClick, handleDeactivateClick, handleRowClick }: Props
) => {
  const { t } = useTranslation();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-75">
            {t("center_managers.list_page.table.headers.name")}
          </TableHead>

          <TableHead className="w-75">
            {t("center_managers.list_page.table.headers.rfc")}
          </TableHead>

          <TableHead className="w-70">
            {t("center_managers.list_page.table.headers.status")}
          </TableHead>

          <TableHead className="w-25 text-center">
            {t("center_managers.list_page.table.headers.actions")}
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {centerManagers.map((centerManager) => (
          <TableRow key={centerManager.id} className="transition-colors cursor-pointer"
            onClick={() => handleRowClick(centerManager.id)}>

            {/* NOMBRE */}
            <TableCell className="text-muted-foreground">
              <div className="max-w-70 line-clamp-2 font-medium">
                {getFullName(centerManager.names,
                  centerManager.first_last_name,
                  centerManager.second_last_name
                )}
              </div>
            </TableCell>

            {/* RFC */}
            <TableCell className="text-muted-foreground">
              <div className="max-w-70 line-clamp-2 font-mono">
                {centerManager.rfc}
              </div>
            </TableCell>

            {/* ESTADO (Usando las variantes de Shadcn) */}
            <TableCell>
              <CustomIsActiveBadge isActive={centerManager.is_active} />
            </TableCell>

            {/* ACCIONES */}
            <TableCell className="text-center">
              <div onClick={(e) => e.stopPropagation()}>
                <CustomActionsMenuCenterManagers
                  centerManager={centerManager}
                  handleActivateClick={handleActivateClick}
                  handleDeactivateClick={handleDeactivateClick}
                />
              </div>
            </TableCell>
          </TableRow>
        ))}

        {/* ESTADO VACÍO */}
        {centerManagers.length === 0 && (
          <TableRow>
            <TableCell colSpan={4} className="h-75">
              <CustomEmptyListState
                icon={UserX}
                title={t("center_managers.list_page.empty.title")}
                description={t("center_managers.list_page.empty.description")}
              />
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
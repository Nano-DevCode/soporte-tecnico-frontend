import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Ban, CircleCheck, Eye, MoreHorizontal, Pencil } from "lucide-react";
import { Link } from "react-router"; // Asegúrate de que sea react-router-dom
import type { Equipment } from "../interfaces/equipment.interface";
import { useEquipmentDialogStore } from "../store/equipment-dialog.store";
import { t } from "i18next";

interface Props {
  equipment: Equipment;
}

export const CustomEquipmentActionsMenu = ({ equipment }: Props) => {
  const { openDialog } = useEquipmentDialogStore();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground focus-visible:ring-0"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48 rounded-xl shadow-lg border-border">
        <div className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">
          {t("ui_menu_equipment_options")}
        </div>

        {/* VER DETALLES */}
        <DropdownMenuItem className="gap-2 cursor-pointer py-2.5" asChild>
          <Link to={`/equipments/details/${equipment.id}`}>
            <Eye className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{t("ui_menu_view_details")}</span>
          </Link>
        </DropdownMenuItem>

        {/* EDITAR */}
        <DropdownMenuItem className="gap-2 cursor-pointer py-2.5" asChild>
          <Link to={`/equipments/edit/${equipment.id}`}>
            <Pencil className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{t("ui_menu_edit_record")}</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="opacity-50" />

        {/* ACTIVAR: Solo si status es false */}
        {equipment.status === false && (
          <DropdownMenuItem
            className="flex items-center gap-2 cursor-pointer py-2.5 text-emerald-600 focus:text-emerald-600 focus:bg-emerald-50 font-medium"
            onClick={() => openDialog(equipment, 'activate')}
          >
            <CircleCheck className="h-4 w-4" />
            <span className="text-sm">{t("ui_menu_activate_equipment")}</span>
          </DropdownMenuItem>
        )}

        {/* DESACTIVAR: Solo si status es true */}
        {equipment.status === true && (
          <DropdownMenuItem
            className="flex items-center gap-2 cursor-pointer py-2.5 text-red-600 focus:text-red-600 focus:bg-red-50 font-medium"
            onClick={() => openDialog(equipment, 'deactivate')}
          >
            <Ban className="h-4 w-4" />
            <span className="text-sm">{t("ui_menu_deactivate_equipment")}</span>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
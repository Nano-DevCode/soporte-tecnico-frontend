import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router";
import { t } from "i18next";
import type { Consumable } from "../interfaces/consumable.interfaces";
// import type { BatchProductItem } from "../actions/get-batches-consumables";

interface Props {
  consumable: Consumable;
  handleDownClick: (consumable: Consumable) => void; // Ejecuta el borrado o confirmación
}

export const CustomConsumableActionsMenu = ({
  consumable,
  handleDownClick
}: Props) => {

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-48">

          {/* VER DETALLES */}
          <DropdownMenuItem className="gap-2 cursor-pointer" asChild>
            <Link to={`/consumables/details/${consumable.id}`}>
              <Eye className="h-4 w-4 text-muted-foreground" />
              {t("custom_consumable_actions_menu_view_details")}
            </Link>
          </DropdownMenuItem>

          {/* EDITAR */}
          <DropdownMenuItem className="gap-2 cursor-pointer" asChild>
            <Link to={`/consumables/edit/${consumable.id}`}>
              <Pencil className="h-4 w-4 text-muted-foreground" />
              {t("custom_consumable_actions_menu_edit")}
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* ACCIÓN DE ELIMINAR / BAJA */}
          <DropdownMenuItem
            className="gap-2 cursor-pointer font-medium text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/30 transition-colors"
            onClick={() => handleDownClick(consumable)}
          >
            <Trash2 className="h-4 w-4" />
            {t("custom_consumable_actions_menu_delete")}
          </DropdownMenuItem>

        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
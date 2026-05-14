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
          Opciones de Equipo
        </div>

        {/* VER DETALLES */}
        <DropdownMenuItem className="gap-2 cursor-pointer py-2.5" asChild>
          {/* Ajustado a la ruta plural 'equipments' */}
          <Link to={`/equipments/details/${equipment.id}`}>
            <Eye className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Ver Detalles</span>
          </Link>
        </DropdownMenuItem>

        {/* EDITAR */}
        <DropdownMenuItem className="gap-2 cursor-pointer py-2.5" asChild>
          {/* CORRECCIÓN: Cambiado de /equipment/ a /equipments/ para coincidir con tus rutas */}
          <Link to={`/equipments/edit/${equipment.id}`}>
            <Pencil className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Editar Registro</span>
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
            <span className="text-sm">Activar equipo</span>
          </DropdownMenuItem>
        )}

        {/* DESACTIVAR: Solo si status es true */}
        {equipment.status === true && (
          <DropdownMenuItem
            className="flex items-center gap-2 cursor-pointer py-2.5 text-red-600 focus:text-red-600 focus:bg-red-50 font-medium"
            onClick={() => openDialog(equipment, 'deactivate')}
          >
            <Ban className="h-4 w-4" />
            <span className="text-sm">Desactivar equipo</span>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
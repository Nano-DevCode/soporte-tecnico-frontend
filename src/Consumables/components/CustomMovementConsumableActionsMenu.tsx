// import { memo } from "react";
// import {
//     DropdownMenu,
//     DropdownMenuItem,
// } from "@/components/ui/dropdown-menu";
// import type { MovementsConsumableItem } from "../actions/get-movement-consumables.actions";
// import { t } from "i18next";
// import { Link } from "react-router";

// interface Props {
//     movement: MovementsConsumableItem;
// }

// export const CustomMovementConsumableActionsMenu = memo(({ movement }: Props) => {
//     const handleViewDetails = () => {
//         // Aquí puedes disparar tu diálogo o redirección global
//         console.log("Ver detalle del movimiento:", movement.id);
//     };

//     const handlePrintSummary = () => {
//         // Lógica para consumir tu endpoint de resumen /summary/:code si se requiere
//         console.log("Código de aplicación para resumen:", movement.code_movement_aplication);
//     };

//     return (
//         <DropdownMenu>
//                 <DropdownMenuItem onClick={handlePrintSummary} className="cursor-pointer gap-2">
//                     <Link to={`/consumables/batches/${movement.id}`}>
//                         <Eye className="h-4 w-4 text-muted-foreground" />
//                         {t("custom_consumable_actions_menu_view_details")}
//                     </Link>
//                 </DropdownMenuItem>
//         </DropdownMenu>
//     );
// });

// CustomMovementConsumableActionsMenu.displayName = "CustomMovementConsumableActionsMenu";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Eye, MoreHorizontal } from "lucide-react";
import { Link } from "react-router";
import { t } from "i18next";
//import type { Consumable } from "../interfaces/consumable.interfaces";
// import type { Movem } from "../actions/get-batches-consumables";
import type { MovementsConsumableItem } from "../actions/get-movement-consumables.actions";


interface Props {
    movement: MovementsConsumableItem;
}

export const CustomMovementConsumableActionsMenu = ({
    movement,
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
                        <Link to={`/consumables/batches/${movement.id}`}>
                            <Eye className="h-4 w-4 text-muted-foreground" />
                            {t("custom_consumable_actions_menu_view_details")}
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
};
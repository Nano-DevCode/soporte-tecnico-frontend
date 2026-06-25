import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil } from "lucide-react";
import { Link } from "react-router";
import { t } from "i18next";
import type { Consumable } from "../interfaces/consumable.interfaces";
import { CanAction } from "../permissions/Can"

interface Props {
  consumable: Consumable;
}

export const CustomConsumableActionsMenu = ({ consumable }: Props) => {
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

          <CanAction permission="EDIT_CONSUMABLE">
            <DropdownMenuItem className="gap-2 cursor-pointer " asChild>
              <Link to={`/consumables/edit/${consumable.id}`}>
                <Pencil className="h-4 w-4 text-muted-foreground" />
                {t("custom_consumable_actions_menu_edit")}
              </Link>
            </DropdownMenuItem>
          </CanAction>

        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
// import { Button } from "@/components/ui/button";
// import { MoreHorizontal, Pencil } from "lucide-react";
// import { Link } from "react-router";
// import { t } from "i18next";
// import type { Consumable } from "../interfaces/consumable.interfaces";
// // import type { BatchProductItem } from "../actions/get-batches-consumables";

// interface Props {
//   consumable: Consumable;
//   // handleDownClick: (consumable: Consumable) => void; // Ejecuta el borrado o confirmación
// }

// export const CustomConsumableActionsMenu = ({
//   consumable,
//   // handleDownClick
// }: Props) => {

//   return (
//     <>
//       <DropdownMenu>
//         <DropdownMenuTrigger asChild>
//           <Button
//             variant="ghost"
//             size="icon"
//             className="h-8 w-8 text-muted-foreground hover:text-foreground"
//           >
//             <MoreHorizontal className="h-4 w-4" />
//           </Button>
//         </DropdownMenuTrigger>

//         <DropdownMenuContent align="end" className="w-48">

//           {/* EDITAR */}
//           [Lo puede ver el rol : SuperAdmin, Coordinador, Inventario ]
//           <DropdownMenuItem className="gap-2 cursor-pointer" asChild>
//             <Link to={`/consumables/edit/${consumable.id}`}>
//               <Pencil className="h-4 w-4 text-muted-foreground" />
//               {t("custom_consumable_actions_menu_edit")}
//             </Link>
//           </DropdownMenuItem>

//         </DropdownMenuContent>
//       </DropdownMenu>
//     </>
//   );
// };
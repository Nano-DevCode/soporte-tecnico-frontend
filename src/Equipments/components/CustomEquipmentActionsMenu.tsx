// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
// import type { Department } from "../interfaces/equipment.interface";
// import { Button } from "@/components/ui/button";
// import { Eye, MoreHorizontal, Pencil, PowerOff, CheckCircle } from "lucide-react"; // Íconos actualizados
// import { Link } from "react-router";
// import { cn } from "@/lib/utils";

// interface Props {
//   department: Department;
//   handleDownClick: (department: Department) => void;
// }

// export const CustomDepartmentActionsMenu = ({
//   department, handleDownClick
// }: Props ) => {
  
//   const isActive = department.status;

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
          
//           <DropdownMenuItem className="gap-2 cursor-pointer" asChild>
//             <Link to={`/department/details/${department.id}`}>
//               <Eye className="h-4 w-4 text-muted-foreground" />
//               Ver Detalles
//             </Link>
//           </DropdownMenuItem>
          
//           <Link to={`/department/edit/${department.id}`}>
//             <DropdownMenuItem className="gap-2 cursor-pointer">
//               <Pencil className="h-4 w-4 text-muted-foreground" />
//               Editar
//             </DropdownMenuItem>
//           </Link>
          
//           <DropdownMenuSeparator />

//           <DropdownMenuItem 
//             className={cn(
//               "gap-2 cursor-pointer font-medium transition-colors",
//               isActive 
//                 ? "text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/30" 
//                 : "text-emerald-600 focus:text-emerald-600 focus:bg-emerald-50 dark:focus:bg-emerald-950/30"
//             )}
//             onClick={() => handleDownClick(department)}
//           >
//             {isActive ? (
//               <>
//                 <PowerOff className="h-4 w-4" />
//                 Suspender
//               </>
//             ) : (
//               <>
//                 <CheckCircle className="h-4 w-4" />
//                 Habilitar
//               </>
//             )}
//           </DropdownMenuItem>
          
//         </DropdownMenuContent>
//       </DropdownMenu>
//     </>
//   )
// }
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react"; 
import { Link } from "react-router";
import type { Equipment } from "../interfaces/equipment.interface";

interface Props {
  equipment: Equipment;
  onDelete: (equipment: Equipment) => void; // Función para abrir el diálogo de confirmación
}

export const CustomEquipmentActionsMenu = ({
  equipment, 
  onDelete
}: Props) => {
  
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
          <Link to={`/equipment/details/${equipment.id}`}>
            <Eye className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Ver Detalles</span>
          </Link>
        </DropdownMenuItem>
        
        {/* EDITAR */}
        <DropdownMenuItem className="gap-2 cursor-pointer py-2.5" asChild>
          <Link to={`/equipment/edit/${equipment.id}`}>
            <Pencil className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Editar Registro</span>
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator className="opacity-50" />

        {/* ELIMINAR */}
        <DropdownMenuItem 
          className="gap-2 cursor-pointer py-2.5 text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/30 font-medium"
          onClick={() => onDelete(equipment)}
        >
          <Trash2 className="h-4 w-4" />
          <span className="text-sm">Eliminar Equipo</span>
        </DropdownMenuItem>
        
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
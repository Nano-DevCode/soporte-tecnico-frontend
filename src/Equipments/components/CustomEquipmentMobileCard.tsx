// import { memo } from "react";
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// import { Building2, Hash, Tag } from "lucide-react";
// import { CustomDepartmentActionsMenu } from "./CustomDepartmentActionsMenu";
// import { Badge } from "@/components/ui/badge";
// import { cn } from "@/lib/utils";
// import type { Department } from "../interfaces/department.interface";

// interface Props {
//   departments: Department[];
//   handleDownClick: (department: Department) => void;
// }

// // Envuelto en memo() para evitar que sea el "Render Fantasma"
// export const CustomDepartmentMobileCard = memo(({ departments, handleDownClick }: Props) => {
//   return (
//     <div className="md:hidden space-y-3">
//       {departments.map((department) => (
//         <div
//           key={department.id}
//           className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 shadow-sm transition-colors hover:bg-muted/50"
//         >
//           {/* Avatar con el Acrónimo o las primeras 2 letras del nombre */}
//           <Avatar className="mt-0.5 h-10 w-10 shrink-0 border border-border">
//             <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold uppercase">
//               {department.acronym 
//                 ? department.acronym.substring(0, 3) 
//                 : department.name.substring(0, 2)}
//             </AvatarFallback>
//           </Avatar>

//           <div className="min-w-0 flex-1 space-y-2">
//             {/* Top: Acrónimo (Badge) + ID Corto */}
//             <div className="flex items-start justify-between gap-2">
//               <span className="text-[10px] font-mono font-bold text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
//                 {department.acronym || 'S/A'}
//               </span>
//               <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/50">
//                 ID: {department.id}
//               </span>
//             </div>

//             {/* Nombre del Departamento */}
//             <p className="text-sm font-bold text-foreground leading-snug whitespace-normal break-words">
//               {department.name}
//             </p>

//             {/* Detalles: Folio */}
//             {department.folio && (
//               <div className="flex items-start gap-1.5 text-xs text-muted-foreground">
//                 <Hash className="h-3.5 w-3.5 shrink-0 mt-0.5" />
//                 <span className="whitespace-normal break-all leading-relaxed">
//                   Folio: {department.folio}
//                 </span>
//               </div>
//             )}

//             {/* Detalles: Prioridad */}
//             {department.priority && (
//               <div className="flex items-start gap-1.5 text-xs text-muted-foreground">
//                 <Tag className="h-3.5 w-3.5 shrink-0 mt-0.5" />
//                 <span className="whitespace-normal break-words leading-relaxed">
//                   Prioridad: {department.priority}
//                 </span>
//               </div>
//             )}

//             {/* Status */}
//             <div className="pt-1">
//               <Badge
//                 variant="outline"
//                 className={cn(
//                   "font-semibold text-[10px] px-2 py-0 rounded-full border-none", 
//                   department.status === true 
//                     ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400" 
//                     : "bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-400"
//                 )}
//               >
//                 {department.status === true ? 'Activo' : 'Inactivo'}
//               </Badge>
//             </div>
//           </div>

//           <div className="shrink-0">
//             {/* Menú de acciones */}
//             <CustomDepartmentActionsMenu 
//               department={department} 
//               handleDownClick={handleDownClick} 
//             />
//           </div>
//         </div>
//       ))}

//       {/* Estado Vacío */}
//       {departments.length === 0 && (
//         <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card py-16">
//           <Building2 className="h-10 w-10 text-muted-foreground/40" />
//           <p className="mt-3 text-sm font-medium text-muted-foreground">
//             No se encontraron departamentos
//           </p>
//           <p className="mt-1 text-xs text-muted-foreground/70 text-center px-4">
//             Intenta ajustar los filtros de búsqueda o crea un nuevo departamento
//           </p>
//         </div>
//       )}
//     </div>
//   )
// });
import { memo } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Monitor, Printer, Network, User, Cpu, Layers, Box, Info } from "lucide-react";
import { CustomEquipmentActionsMenu } from "./CustomEquipmentActionsMenu";
import type { Equipment, EquipmentCategory } from "../interfaces/equipment.interface";

interface Props {
  equipments: Equipment[];
  category: EquipmentCategory | 'all';
  onDelete: (id: string) => void;
}

export const CustomEquipmentMobileCard = memo(({ equipments, category, onDelete }: Props) => {
  
  // Normalizamos la categoría para evitar errores de "no overlap" en TS
  const currentCat = String(category).toLowerCase();

  const isComputer = currentCat === 'computer' || currentCat === 'computadora';
  const isPrinter  = currentCat === 'printer'  || currentCat === 'impresora';
  const isNetwork  = currentCat === 'network'  || currentCat === 'red';

  return (
    <div className="md:hidden space-y-3">
      {equipments.length > 0 ? (
        equipments.map((eq) => (
          <div key={eq.id} className="rounded-xl border border-border bg-card p-4 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
            
            {/* Cabecera de la Card */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9 border border-border">
                  <AvatarFallback className="bg-muted">
                    {/* Iconos dinámicos según el tipo que venga del back */}
                    {(eq.type === 'computadora' || eq.type === 'computer') && <Monitor className="h-4 w-4 text-blue-500" />}
                    {(eq.type === 'impresora' || eq.type === 'printer') && <Printer className="h-4 w-4 text-purple-500" />}
                    {(eq.type === 'red' || eq.type === 'network') && <Network className="h-4 w-4 text-emerald-500" />}
                    {(!['computadora', 'computer', 'impresora', 'printer', 'red', 'network'].includes(eq.type || '')) && <Box className="h-4 w-4 text-slate-400" />}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-[10px] font-mono text-muted-foreground leading-none">#{eq.folio}</p>
                  <p className="text-sm font-bold leading-tight mt-1">{eq.model}</p>
                  <p className="text-[10px] uppercase font-medium text-primary/70">{eq.type}</p>
                </div>
              </div>
              <CustomEquipmentActionsMenu equipment={eq} onDelete={() => onDelete(eq.id)} />
            </div>

            {/* Cuerpo de la Card */}
            <div className="space-y-2 border-t border-border pt-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <User className="h-3 w-3" />
                <span>Responsable: <strong className="text-foreground/80">{eq.responsableName || "Sin asignar"}</strong></span>
              </div>

              {/* DETALLES TÉCNICOS: Solo si la categoría es específica y conocida */}
              
              {isComputer && (
                <div className="grid grid-cols-1 gap-2 bg-muted/30 p-2 rounded-lg">
                  <div className="flex items-center gap-2 text-[11px]">
                    <Cpu className="h-3 w-3 text-blue-500 shrink-0" />
                    <span className="truncate">Proc: {eq.processor || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px]">
                    <Layers className="h-3 w-3 text-orange-500 shrink-0" />
                    <span>RAM: {eq.ram || 'N/A'} | SO: {eq.operatingSystem || 'N/A'}</span>
                  </div>
                </div>
              )}

              {isPrinter && (
                <div className="space-y-1 bg-muted/30 p-2 rounded-lg text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Funcionalidad:</span>
                    <span className="font-medium text-purple-600">{eq.typefunction || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Impresión:</span>
                    <span className="font-medium">{eq.typeprinting || 'N/A'}</span>
                  </div>
                </div>
              )}

              {isNetwork && (
                <div className="flex justify-between items-center bg-muted/30 p-2 rounded-lg text-[11px]">
                  <span className="font-medium text-emerald-600 truncate mr-2">
                    {eq.typeEquipmentNetwork || 'Equipo de Red'}
                  </span>
                  <Badge variant="outline" className="h-5 text-[10px] shrink-0">
                    {eq.numberPorts ? `${eq.numberPorts} Ptos` : 'N/A'}
                  </Badge>
                </div>
              )}

              {/* Si es vista General o un tipo nuevo, no mostramos el bloque de detalles técnicos */}
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-10 bg-muted/20 rounded-xl border border-dashed">
          <Info className="h-8 w-8 mx-auto text-muted-foreground/50 mb-2" />
          <p className="text-sm text-muted-foreground">No hay equipos registrados.</p>
        </div>
      )}
    </div>
  );
});
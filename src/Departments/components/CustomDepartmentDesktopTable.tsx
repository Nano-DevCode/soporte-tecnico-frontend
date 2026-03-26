import { memo } from "react";
import { TableBody, TableCell, TableHead, TableHeader, TableRow, Table } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Building2, Hash, Layers, Settings2 } from "lucide-react";
import type { Department } from "../interfaces/department.interface";
import { CustomDepartmentActionsMenu } from "./CustomDepartmentActionsMenu";

interface Props {
  departments: Department[];
  handleDownClick: (dept: Department) => void;
}

// Envuelto en memo() para evitar re-renderizados innecesarios
export const CustomDepartmentDesktopTable = memo(({ departments, handleDownClick }: Props) => {

  return (
    <div className="hidden md:block rounded-xl border border-border shadow-sm overflow-hidden bg-card">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="w-[100px] text-center">
              <div className="flex items-center justify-center gap-2">
                <Hash className="h-3.5 w-3.5" />
                <span>Folio</span>
              </div>
            </TableHead>
            <TableHead className="w-[120px]">Acrónimo</TableHead>
            <TableHead className="min-w-[250px]">Nombre del Departamento</TableHead>
            <TableHead className="w-[120px] text-center">Prioridad</TableHead>
            <TableHead className="w-[120px] text-center">Estado</TableHead>
            <TableHead className="w-[80px] text-center">
              <Settings2 className="h-4 w-4 mx-auto opacity-70" />
            </TableHead>
          </TableRow>
        </TableHeader>
        
        <TableBody>
          {departments.map((dept) => (
            <TableRow key={dept.id} className="group transition-colors hover:bg-muted/30">
              {/* FOLIO */}
              <TableCell className="text-center font-mono text-sm text-muted-foreground py-4">
                #{dept.folio}
              </TableCell>

              {/* ACRÓNIMO */}
              <TableCell className="py-4">
                <span className="inline-flex items-center justify-center px-2 py-1 rounded bg-primary/10 text-primary text-xs font-bold border border-primary/20">
                  {dept.acronym}
                </span>
              </TableCell>
              
              {/* NOMBRE */}
              <TableCell className="py-4">
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-foreground italic decoration-primary/30">
                    {dept.name}
                  </span>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                    ID: {dept.id}
                  </span>
                </div>
              </TableCell>

              {/* PRIORIDAD */}
              <TableCell className="text-center py-4">
                <div className="flex items-center justify-center gap-1.5">
                  <Layers className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-sm font-medium">{dept.priority}</span>
                </div>
              </TableCell>
              
              {/* ESTADO */}
              <TableCell className="text-center py-4 uppercase">
                <Badge 
                  variant={dept.status ? "default" : "destructive"}
                  className="font-bold px-3 py-0.5 rounded-full text-[10px] shadow-sm"
                >
                  {dept.status ? "Activo" : "Inactivo"}
                </Badge>
              </TableCell>
              
              {/* ACCIONES */}
              <TableCell className="text-center py-4">
                <div className="flex justify-center">
                  <CustomDepartmentActionsMenu 
                    department={dept} 
                    handleDownClick={handleDownClick} 
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}

          {/* EMPTY STATE */}
          {departments.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="h-64 text-center">
                <div className="flex flex-col items-center justify-center gap-3">
                  <div className="p-4 rounded-full bg-muted">
                    <Building2 className="h-8 w-8 text-muted-foreground/50" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-base font-semibold">No se encontraron departamentos</p>
                    <p className="text-sm text-muted-foreground">Intenta ajustar los filtros de búsqueda</p>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
});

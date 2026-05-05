import { memo } from "react";
import { TableBody, TableCell, TableHead, TableHeader, TableRow, Table } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Building2, Layers } from "lucide-react";
import { t } from "i18next";
import type { Tool } from "../interfaces/toolsResponse";
import { CustomToolActionsMenu } from "./CustomToolActionsMenu";

interface Props {
  tools: Tool[];
  handleDownClick: (tool: Tool) => void;
}

export const CustomToolDesktopTable = memo(({ tools, handleDownClick }: Props) => {

  return (
    <div className="hidden md:block rounded-xl border border-border shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px] text-center">
              ID
            </TableHead>
            <TableHead className="w-[100px] text-left">
              Tipo
            </TableHead>
            <TableHead className="w-[100px] text-center">
              Cantidad
            </TableHead>
            <TableHead className="w-[160px] text-center">
              Marca
            </TableHead>
            <TableHead className="w-[120px] text-center">
              Estado
            </TableHead>
            <TableHead className="w-[80px] text-center">
              Acciones
            </TableHead>
          </TableRow>
        </TableHeader>
        
        <TableBody>
          {tools.map((tool) => (
            <TableRow key={tool.id} className="group transition-colors">
              
              {/* ID LIMPIO: Ya no necesita el span, el componente base hace el trabajo */}
              <TableCell 
                className="font-mono text-xs font-semibold text-muted-foreground align-middle text-center py-4"
                title={tool.id}
              >
                {tool.id}
              </TableCell>

              {/* TIPO */}
              <TableCell className="align-middle py-4">
                <span className="inline-flex items-center justify-center px-2 py-1 rounded bg-primary/10 text-primary text-xs font-bold border border-primary/20">
                  {tool.type.name}
                </span>
              </TableCell>
              
              {/* CANTIDAD */}
              <TableCell className="align-middle text-center py-4">
                <span className="text-sm font-bold text-foreground">
                  {tool.quantity}
                </span>
              </TableCell>

              {/* MARCA */}
              <TableCell className="align-middle text-center py-4 text-sm">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-secondary text-secondary-foreground text-xs font-semibold border border-border">
                  <Layers className="h-3 w-3 opacity-50" />
                  {tool.model.brand.name}
                </span>
              </TableCell>
              
              {/* ESTADO */}
              <TableCell className="align-middle text-center py-4 uppercase">
                <Badge 
                  variant={tool.status ? "default" : "destructive"}
                  className="font-semibold px-2.5 py-0.5 rounded-full shadow-sm"
                >
                  {tool.status ? t("custom_department_desktop_table_active") : t("custom_department_desktop_table_inactive")}
                </Badge>
              </TableCell>
              
              {/* ACCIONES */}
              <TableCell className="text-center align-middle py-4">
                <div className="flex justify-center">
                  <CustomToolActionsMenu 
                    tool={tool} 
                    handleDownClick={handleDownClick} 
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}

          {/* EMPTY STATE */}
          {tools.length === 0 && (
            <TableRow>
              <TableCell 
                colSpan={6} 
                className="h-[300px] text-center text-muted-foreground"
              >
                <div className="flex flex-col items-center gap-3">
                  <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center border border-border">
                    <Building2 className="h-6 w-6 text-muted-foreground opacity-50" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-base font-semibold text-foreground">
                      No se encontro ningua herramienta
                    </p>
                    <p className="text-sm">
                      Verifica tus filtros
                    </p>
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
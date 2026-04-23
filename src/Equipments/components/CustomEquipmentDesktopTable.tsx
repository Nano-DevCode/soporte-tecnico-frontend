
import { memo } from "react";
import { TableBody, TableCell, TableHead, TableHeader, TableRow, Table } from "@/components/ui/table";
// import { Badge } from "@/components/ui/badge";
// import { Settings2, User, Monitor, Printer, Network } from "lucide-react";
import { CustomEquipmentActionsMenu } from "./CustomEquipmentActionsMenu";
import type { Equipment, EquipmentCategory } from "../interfaces/equipment.interface";
import { Box, Monitor, Network, Printer, Settings2 } from "lucide-react";


interface Props {
  equipments: Equipment[];
  category: EquipmentCategory | 'all'; // Soporta vista general
  onDelete: (id: string) => void;
}


export const CustomEquipmentDesktopTable = memo(({ equipments = [], category, onDelete }: Props) => {

  // Normalizamos la categoría para comparar sin errores de TypeScript
  const currentCat = String(category).toLowerCase();

  const isComputer = currentCat === 'computer' || currentCat === 'computadora';
  const isPrinter = currentCat === 'printer' || currentCat === 'impresora';
  const isNetwork = currentCat === 'network' || currentCat === 'red';

  return (
    <div className="hidden md:block rounded-xl border border-border shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            {/* Columnas SIEMPRE visibles (Datos Generales) */}
            <TableHead className="w-[120px] text-center">N° Inventario</TableHead>
            <TableHead className="min-w-[140px]">Tipo</TableHead>
            <TableHead className="min-w-[180px]">Modelo</TableHead>
            <TableHead className="min-w-[180px]">Responsable</TableHead>

            {/* Columnas condicionales: Solo aparecen si NO es 'all' y es un tipo conocido */}
            {isComputer && (
              <>
                <TableHead>Procesador</TableHead>
                <TableHead>RAM</TableHead>
                <TableHead>SO</TableHead>
              </>
            )}

            {isPrinter && (
              <>
                <TableHead>Funcionalidad</TableHead>
                <TableHead>Tipo Impresión</TableHead>
              </>
            )}

            {isNetwork && (
              <>
                <TableHead>Tipo de Red</TableHead>
                <TableHead>Puertos</TableHead>
              </>
            )}
            <TableHead className="w-[80px] text-center">Acciones</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {equipments.length > 0 ? (
            equipments.map((eq) => (
              <TableRow key={eq.id} className="group transition-colors hover:bg-muted/30">
                {/* Celdas Generales  colo de texto es text-color-[que tanto de trasparencia]*/}
                <TableCell className="font-bold text-[11px] ">{eq.folio}</TableCell>
                <TableCell className="capitalize">
                  <div className="flex items-center gap-2 ">
                    {/* Contenedor dinámico basado en el tipo de equipo */}
                    {(() => {
                      // Definimos colores y configuraciones por tipo
                      const config: Record<string, { bg: string, text: string, icon: any, label: string }> = {
                        computadora: { bg: "bg-blue-100", text: "text-blue-800", icon: Monitor, label: "Computadora" },
                        computer: { bg: "bg-blue-100", text: "text-blue-800", icon: Monitor, label: "Computadora" },
                        impresora: { bg: "bg-purple-100", text: "text-purple-800", icon: Printer, label: "Impresora" },
                        printer: { bg: "bg-purple-100", text: "text-purple-800", icon: Printer, label: "Impresora" },
                        red: { bg: "bg-amber-100", text: "text-amber-800", icon: Network, label: "Red" },
                        network: { bg: "bg-amber-500", text: "text-amber-800", icon: Network, label: "Red" },
                        default: { bg: "bg-slate-100", text: "text-slate-700", icon: Box, label: eq.type || "Otro" },
                      };
                      const item = config[eq.type?.toLowerCase()] || config.default;
                      const Icon = item.icon;
                      return (
                        <div className={`flex items-center gap-2 px-3 py-1 rounded-full border-border font-medium ${item.bg} ${item.text}`}>
                          <Icon className="h-4 w-4" />
                          <span className="text-[12px] text-blue-900">{item.label}</span>
                        </div>
                      );
                    })()}
                  </div>
                </TableCell>
                <TableCell>{eq.model}</TableCell>
                <TableCell>{eq.responsableName}</TableCell>

                {/* Celdas Dinámicas: Se llenan solo si coinciden con el tipo */}
                {isComputer && (
                  <>
                    <TableCell className="text-xs text-[11px]">{eq.processor || '-'}</TableCell>
                    <TableCell className="text-xs">{eq.ram || '-'}</TableCell>
                    <TableCell className="text-xs">{eq.operatingSystem || '-'}</TableCell>
                  </>
                )}

                {isPrinter && (
                  <>
                    <TableCell className="text-xs">{eq.typefunction || '-'}</TableCell>
                    <TableCell className="text-xs">{eq.typeprinting || '-'}</TableCell>
                  </>
                )}

                {isNetwork && (
                  <>
                    <TableCell className="text-xs">{eq.typeEquipmentNetwork || '-'}</TableCell>
                    <TableCell className="text-xs font-bold">{eq.numberPorts || '-'}</TableCell>
                  </>
                )}

                <TableCell className="text-center">
                  <CustomEquipmentActionsMenu equipment={eq} onDelete={() => onDelete(eq.id)} />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={10} className="text-center py-10">
                No hay datos disponibles para esta categoría.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
});
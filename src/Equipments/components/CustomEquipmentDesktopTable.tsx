import { memo } from "react";
import { TableBody, TableCell, TableHead, TableHeader, TableRow, Table } from "@/components/ui/table";
import { CustomEquipmentActionsMenu } from "./CustomEquipmentActionsMenu";
import type { Equipment, EquipmentCategory } from "../interfaces/equipment.interface";
import { Box, Monitor, Network, Printer, type LucideIcon} from "lucide-react";


interface Props {
  equipments: Equipment[];
  category: EquipmentCategory | 'all';
  // Eliminamos onActivate y onDeactivate de aquí porque el Menú ahora usa el Store directamente
}

export const CustomEquipmentDesktopTable = memo(({ equipments = [], category }: Props) => {

  const currentCat = String(category).toLowerCase();

  const isComputer = currentCat === 'computer' || currentCat === 'computadora';
  const isPrinter = currentCat === 'printer' || currentCat === 'impresora';
  const isNetwork = currentCat === 'network' || currentCat === 'red';
  const isDiferent = currentCat !== 'all' && !isComputer && !isPrinter && !isNetwork;

  const getStatusStyles = (status: boolean) => {
    return status
      ? { color: "bg-emerald-100 text-emerald-700 border-emerald-200", label: "Activo" }
      : { color: "bg-red-100 text-red-700 border-red-200", label: "Inactivo" };
  };

  const formatLongText = (text: string, wordsPerLine = 5, maxWords = 18) => {
    if (!text) return 'Aún no se tiene una descripción';
    const words = text.split(' ');
    const limitedWords = words.slice(0, maxWords);
    const result = [];
    for (let i = 0; i < limitedWords.length; i += wordsPerLine) {
      result.push(limitedWords.slice(i, i + wordsPerLine).join(' '));
    }
    return result.join('\n') + (words.length > maxWords ? ' ...' : '');
  };

  return (
    <div className="hidden md:block rounded-xl border border-border shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className=" text-center font-bold min-w-27.5 max-w-30">N° Inventario</TableHead>
            <TableHead className="min-w-27.5 max-w-30" >Tipo</TableHead>
            <TableHead className="min-w-27.5 max-w-50">Marca - Modelo</TableHead>
            <TableHead className="min-w-27.5 max-w-30">Departamento</TableHead>
            <TableHead className="min-w-27.5 max-w-30">Responsable</TableHead>
            <TableHead className="min-w-27.5 max-w-30">Status</TableHead>

            {isDiferent && <TableHead className="">Descripción</TableHead>}

            {isComputer && (
              <>
                <TableHead className="min-w-27.5 max-w-30">Procesador</TableHead>
                <TableHead className="min-w-27.5 max-w-30">RAM</TableHead>
                <TableHead className="min-w-27.5 max-w-30">SO</TableHead>
              </>
            )}

            {isPrinter && (
              <>
                <TableHead className="min-w-27.5 max-w-30">Funcionalidad</TableHead>
                <TableHead className="min-w-27.5 max-w-30">Tipo Impresión</TableHead>
              </>
            )}

            {isNetwork && (
              <>
                <TableHead className="min-w-27.5 max-w-30">Tipo de Red</TableHead>
                <TableHead className="min-w-27.5 max-w-30">Puertos</TableHead>
              </>
            )}
            <TableHead className=" text-center">Acciones</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody className="text-sm font-medium">
          {equipments.length > 0 ? (
            equipments.map((eq) => (
              <TableRow key={eq.id} className="group transition-colors hover:bg-muted/30">
                <TableCell className="text-center">{eq.folio}</TableCell>

                <TableCell className="max-w-64">
                  {(() => {
                    const config: Record<string, { bg: string, text: string, icon: LucideIcon, label: string }> = {
                      computadora: { bg: "bg-blue-100", text: "text-blue-800", icon: Monitor, label: "Computadora" },
                      computer: { bg: "bg-blue-100", text: "text-blue-800", icon: Monitor, label: "Computadora" },
                      impresora: { bg: "bg-purple-100", text: "text-purple-800", icon: Printer, label: "Impresora" },
                      printer: { bg: "bg-purple-100", text: "text-purple-800", icon: Printer, label: "Impresora" },
                      red: { bg: "bg-amber-100", text: "text-amber-800", icon: Network, label: "Red" },
                      network: { bg: "bg-amber-100", text: "text-amber-800", icon: Network, label: "Red" },
                      default: { bg: "bg-slate-100", text: "text-slate-700", icon: Box, label: eq.type || "Otro" },
                    };
                    const item = config[eq.type?.toLowerCase()] || config.default;
                    const Icon = item.icon;
                    return (
                      <div className={`flex w-fit gap-2 px-2  rounded-full  ${item.bg} ${item.text}`}>
                        <Icon className="h-3.5 w-3.5" />
                        <span className="">{item.label}</span>
                      </div>
                    );
                  })()}
                </TableCell>

                <TableCell className="">{eq.model}</TableCell>
                <TableCell
                    className="font-bold text-[12px]"
                    style={{ maxWidth: '90px' }}
                  >
                    {formatLongText(eq.departamento || '')}
                  </TableCell>
                <TableCell className="">{eq.responsableName}</TableCell>

                <TableCell>
                  <span className={`px-3 py-1 rounded-full text-[12px] font-bold border ${getStatusStyles(eq.status).color}`}>
                    {getStatusStyles(eq.status).label}
                  </span>
                </TableCell>

                {isDiferent && (
                  <TableCell
                    className="text-justify whitespace-pre-line leading-relaxed text-[12px] py-4"
                    style={{ maxWidth: '250px' }}
                  >
                    {/* CORRECCIÓN: Llamamos a la función formatLongText */}
                    {formatLongText(eq.description || '')}
                  </TableCell>
                )}

                {isComputer && (
                  <>
                    <TableCell >{eq.processor || '-'}</TableCell>
                    <TableCell >{eq.ram || '-'}</TableCell>
                    <TableCell >{eq.operatingSystem || '-'}</TableCell>
                  </>
                )}

                {isPrinter && (
                  <>
                    <TableCell >{eq.typefunction || '-'}</TableCell>
                    <TableCell >{eq.typeprinting || '-'}</TableCell>
                  </>
                )}

                {isNetwork && (
                  <>
                    <TableCell className="text-[11px]">{eq.typeEquipmentNetwork || '-'}</TableCell>
                    <TableCell className="text-[11px]">{eq.numberPorts || '0'} Puertos</TableCell>
                  </>
                )}

                <TableCell className="text-center">
                  {/* Simplificamos el menú: ya no necesita recibir funciones manuales */}
                  <CustomEquipmentActionsMenu equipment={eq} />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={12} className="text-center py-20 text-muted-foreground">
                <Box className="h-10 w-10 mx-auto mb-2 opacity-20" />
                No hay datos disponibles para esta categoría.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
});
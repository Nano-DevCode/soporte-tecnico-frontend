import { memo } from "react";
import { TableBody, TableCell, TableHead, TableHeader, TableRow, Table } from "@/components/ui/table";
import { CustomEquipmentActionsMenu } from "./CustomEquipmentActionsMenu";
import type { Equipment, EquipmentCategory } from "../interfaces/equipment.interface";
import { Box, Monitor, Network, Printer, type LucideIcon } from "lucide-react";
import { t } from "i18next";

interface Props {
  equipments: Equipment[];
  category: EquipmentCategory | 'all';
}

export const CustomEquipmentDesktopTable = memo(({ equipments = [], category }: Props) => {

  const currentCat = String(category).toLowerCase();

  const isComputer = currentCat === 'computer' || currentCat === 'computadora';
  const isPrinter = currentCat === 'printer' || currentCat === 'impresora';
  const isNetwork = currentCat === 'network' || currentCat === 'red';
  const isDiferent = currentCat !== 'all' && !isComputer && !isPrinter && !isNetwork;

  // Respetados tus colores y clases personalizadas originales
  const getStatusStyles = (status: boolean) => {
    return status
      ? { color: "bg-gray-950/100 rounded-4lx p-3 py-1.5 border-white bd-2 text-white uppercase", label: t("ui_status_active") }
      : { color: "bg-red-700/100 rounded-4lx p-3 py-1 border-white bd-2 text-white uppercase", label: t("ui_status_inactive") };
  };

  const formatLongText = (text: string, wordsPerLine = 6, maxWords = 18) => {
    if (!text) return t("ui_table_no_description");
    const words = text.split(' ');
    const limitedWords = words.slice(0, maxWords);
    const result = [];
    for (let i = 0; i < limitedWords.length; i += wordsPerLine) {
      result.push(limitedWords.slice(i, i + wordsPerLine).join(' '));
    }
    return result.join('\n') + (words.length > maxWords ? ' ...' : '');
  };

  return (
    <div className="hidden md:block rounded-xl border border-border shadow-sm overflow-x-auto">
      <Table className="w-full table-auto border-collapse">
        <TableHeader>
          <TableRow className="bg-muted/50">
            {/* Los anchos mínimos aseguran espacio proporcional sin romper tus alineaciones */}
            <TableHead className="min-w-[130px] text-center font-bold">{t("ui_th_inventory_no")}</TableHead>
            <TableHead className="min-w-[140px] text-center">{t("ui_th_type")}</TableHead>
            <TableHead className="min-w-[160px] text-left">{t("ui_th_brand_model")}</TableHead>
            <TableHead className="min-w-[160px] text-left">{t("ui_th_department")}</TableHead>
            <TableHead className="min-w-[160px] text-left">{t("ui_th_responsible")}</TableHead>
            <TableHead className="min-w-[120px] text-center">{t("ui_th_status")}</TableHead>

            {isDiferent && <TableHead className="min-w-[250px] text-left">{t("ui_th_description")}</TableHead>}

            {isComputer && (
              <>
                <TableHead className="min-w-[140px] text-left">{t("ui_th_processor")}</TableHead>
                <TableHead className="min-w-[100px] text-left">{t("ui_th_ram")}</TableHead>
                <TableHead className="min-w-[140px] text-left">{t("ui_th_os")}</TableHead>
              </>
            )}

            {isPrinter && (
              <>
                <TableHead className="min-w-[150px] text-left">{t("ui_th_functionality")}</TableHead>
                <TableHead className="min-w-[150px] text-left">{t("ui_th_print_type")}</TableHead>
              </>
            )}

            {isNetwork && (
              <>
                <TableHead className="min-w-[160px] text-left">{t("ui_th_network_type")}</TableHead>
                <TableHead className="min-w-[100px] text-left">{t("ui_th_ports")}</TableHead>
              </>
            )}
            <TableHead className="min-w-[90px] text-center">{t("ui_th_actions")}</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody className="text-sm font-medium">
          {equipments.length > 0 ? (
            equipments.map((eq) => (
              <TableRow key={eq.id} className="group transition-colors hover:bg-muted/30">
                
                {/* Respetada tu alineación a la izquierda original */}
                <TableCell className="text-left whitespace-nowrap px-4 py-3">
                  {eq.folio}
                </TableCell>

                <TableCell className="text-center px-4 py-3">
                  {(() => {
                    const config: Record<string, { bg: string, text: string, icon: LucideIcon, label: string }> = {
                      computadora: { bg: "bg-blue-100", text: "text-blue-800", icon: Monitor, label: t("ui_category_computer") },
                      computer: { bg: "bg-blue-100", text: "text-blue-800", icon: Monitor, label: t("ui_category_computer") },
                      impresora: { bg: "bg-purple-100", text: "text-purple-800", icon: Printer, label: t("ui_category_printer") },
                      printer: { bg: "bg-purple-100", text: "text-purple-800", icon: Printer, label: t("ui_category_printer") },
                      red: { bg: "bg-amber-100", text: "text-amber-800", icon: Network, label: t("ui_category_network") },
                      network: { bg: "bg-amber-100", text: "text-amber-800", icon: Network, label: t("ui_category_network") },
                      default: { bg: "bg-slate-100", text: "text-slate-700", icon: Box, label: eq.type || t("ui_category_other") },
                    };

                    const item = config[eq.type?.toLowerCase()] || config.default;
                    const Icon = item.icon;

                    return (
                      <div className="flex justify-center w-full">
                        <div className={`
                          flex items-center justify-center 
                          py-1 px-3 gap-2 
                          rounded-full w-fit whitespace-nowrap
                          text-[11px] font-bold uppercase tracking-wider
                          ${item.bg} ${item.text}
                        `}>
                          <Icon className="h-3.5 w-3.5 flex-shrink-0" />
                          <span className="leading-none">{item.label}</span>
                        </div>
                      </div>
                    );
                  })()}
                </TableCell>

                <TableCell className="break-all px-4 py-3">
                  {eq.model}
                </TableCell>
                
                {/* Respetado el tamaño exacto text-[12px] de tu departamento */}
                <TableCell className="font-bold text-[12px] px-4 py-3" style={{ maxWidth: '140px' }}>
                  {formatLongText(eq.departamento || '')}
                </TableCell>
                
                <TableCell className="break-words px-4 py-3">
                  {eq.responsableName}
                </TableCell>

                <TableCell className="text-center whitespace-nowrap px-4 py-3">
                  {/* Respetado tu diseño exacto con text-[10px] y font-extrabold */}
                  <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold border ${getStatusStyles(eq.status).color}`}>
                    {getStatusStyles(eq.status).label}
                  </span>
                </TableCell>

                {isDiferent && (
                  <TableCell className="text-justify whitespace-pre-line leading-relaxed text-[12px] px-4 py-3" style={{ maxWidth: '250px' }}>
                    {formatLongText(eq.description || '')}
                  </TableCell>
                )}

                {isComputer && (
                  <>
                    <TableCell className="break-words px-4 py-3">{eq.processor || '-'}</TableCell>
                    <TableCell className="whitespace-nowrap px-4 py-3">{eq.ram || '-'}</TableCell>
                    <TableCell className="break-words px-4 py-3">{eq.operatingSystem || '-'}</TableCell>
                  </>
                )}

                {isPrinter && (
                  <>
                    <TableCell className="break-words px-4 py-3">{eq.typefunction || '-'}</TableCell>
                    <TableCell className="break-words px-4 py-3">{eq.typeprinting || '-'}</TableCell>
                  </>
                )}

                {isNetwork && (
                  <>
                    <TableCell className="break-words px-4 py-3">{eq.typeEquipmentNetwork || '-'}</TableCell>
                    <TableCell className="whitespace-nowrap px-4 py-3">
                      {t("ui_table_ports_count", { count: +(eq.numberPorts || 0) })}
                    </TableCell>
                  </>
                )}

                <TableCell className="text-center px-4 py-3">
                  <CustomEquipmentActionsMenu equipment={eq} />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={15} className="text-center py-20 text-muted-foreground">
                <Box className="h-10 w-10 mx-auto mb-2 opacity-20" />
                {t("ui_table_no_data")}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
});
CustomEquipmentDesktopTable.displayName = "CustomEquipmentDesktopTable";
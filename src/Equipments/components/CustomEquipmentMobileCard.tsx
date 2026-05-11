import { memo } from "react";
import { Monitor, Printer, Network, User, Cpu, Layers, Box, Info, MonitorCloud, PrinterCheck, FileArchive, Router, EthernetPortIcon, Power, PowerIcon, type LucideIcon } from "lucide-react";
import { CustomEquipmentActionsMenu } from "./CustomEquipmentActionsMenu";
import type { Equipment, EquipmentCategory } from "../interfaces/equipment.interface";

interface Props {
  equipments: Equipment[];
  category: EquipmentCategory | 'all';
  // Se elimina onDelete de las props ya que el Menú usa el Store global
}

export const CustomEquipmentMobileCard = memo(({ equipments, category }: Props) => {

  const currentCat = String(category).toLowerCase();

  const isComputer = currentCat === 'computer' || currentCat === 'computadora';
  const isPrinter = currentCat === 'printer' || currentCat === 'impresora';
  const isNetwork = currentCat === 'network' || currentCat === 'red';
  const isDiferent = currentCat !== 'all' && !isComputer && !isPrinter && !isNetwork;

  return (
    <div className="md:hidden space-y-3">
      {equipments.length > 0 ? (
        equipments.map((eq) => (
          <div key={eq.id} className="rounded-xl border border-border bg-card p-4 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">

            {/* Cabecera de la Card */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  {(() => {
                    const config: Record<string, { bg: string, text: string, icon: LucideIcon }> = {
                      computadora: { bg: "bg-blue-100", text: "text-blue-800", icon: Monitor },
                      computer: { bg: "bg-blue-100", text: "text-blue-800", icon: Monitor },
                      impresora: { bg: "bg-purple-100", text: "text-purple-800", icon: Printer },
                      printer: { bg: "bg-purple-100", text: "text-purple-800", icon: Printer },
                      red: { bg: "bg-amber-100", text: "text-amber-800", icon: Network },
                      network: { bg: "bg-amber-100", text: "text-amber-800", icon: Network },
                      default: { bg: "bg-slate-100", text: "text-slate-700", icon: Box },
                    };
                    const item = config[eq.type?.toLowerCase()] || config.default;
                    const Icon = item.icon;
                    return (
                      <div className={`flex items-center justify-center h-10 w-10 rounded-full border border-transparent font-medium ${item.bg} ${item.text}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                    );
                  })()}
                </div>
                <div>
                  <p className="text-sm font-bold leading-tight"># {eq.folio}</p>
                  <p className="text-[12px] font-mono text-muted-foreground leading-none mt-1">{eq.model}</p>
                </div>
              </div>

              {/* El menú ahora solo recibe el equipo */}
              <CustomEquipmentActionsMenu equipment={eq} />
            </div>

            {/* Cuerpo de la Card */}
            <div className="space-y-2 border-t border-border pt-3">
              <div  className="border-amber-300  border-2 rounded-full text-xs text- text-center ">
                <strong>{eq.departamento}{eq.departamentStatus}</strong>
              </div>

              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <User className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                <span>Responsable: <strong className="text-foreground/80">{eq.responsableName || "Sin asignar"}</strong></span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <PowerIcon className={`h-3.5 w-3.5 shrink-0 ${eq.status ? 'text-emerald-500' : 'text-red-500'}`} />
                <span>Estado: <strong className={eq.status ? 'text-emerald-600' : 'text-red-600'}>{eq.status ? 'Activo' : 'Inactivo'}</strong></span>
              </div>

              {/* DESCRIPCIÓN PARA OTROS TIPOS */}
              {isDiferent && (
                <div className="bg-muted/30 p-2 rounded-lg mt-2">
                  <div className="flex gap-2 text-xs">
                    <Info className="h-3.5 w-3.5 text-blue-500 shrink-0 mt-0.5" />
                    <p className="text-muted-foreground leading-relaxed">
                      <span className="font-semibold block mb-1">Descripción:</span>
                      {eq.description || 'Sin descripción disponible.'}
                    </p>
                  </div>
                </div>
              )}

              {/* DETALLES TÉCNICOS POR CATEGORÍA */}
              {isComputer && (
                <div className="grid grid-cols-1 gap-1.5 bg-muted/30 p-2 rounded-lg mt-2 text-[12px]">
                  <div className="flex items-center gap-2">
                    <Cpu className="h-3.5 w-3.5 text-blue-500" />
                    <span className="text-muted-foreground">Procesador:</span>
                    <span className="font-medium">{eq.processor || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Layers className="h-3.5 w-3.5 text-orange-500" />
                    <span className="text-muted-foreground">RAM:</span>
                    <span className="font-medium">{eq.ram || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MonitorCloud className="h-3.5 w-3.5 text-red-500" />
                    <span className="text-muted-foreground">SO:</span>
                    <span className="font-medium">{eq.operatingSystem || 'N/A'}</span>
                  </div>
                </div>
              )}

              {isPrinter && (
                <div className="grid grid-cols-1 gap-1.5 bg-muted/30 p-2 rounded-lg mt-2 text-[12px]">
                  <div className="flex items-center gap-2">
                    <PrinterCheck className="h-3.5 w-3.5 text-blue-500" />
                    <span className="text-muted-foreground">Función:</span>
                    <span className="font-medium">{eq.typefunction || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileArchive className="h-3.5 w-3.5 text-orange-500" />
                    <span className="text-muted-foreground">Tipo:</span>
                    <span className="font-medium">{eq.typeprinting || 'N/A'}</span>
                  </div>
                </div>
              )}

              {isNetwork && (
                <div className="grid grid-cols-1 gap-1.5 bg-muted/30 p-2 rounded-lg mt-2 text-[12px]">
                  <div className="flex items-center gap-2">
                    <Router className="h-3.5 w-3.5 text-red-500" />
                    <span className="text-muted-foreground">Tipo:</span>
                    <span className="font-medium">{eq.typeEquipmentNetwork || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <EthernetPortIcon className="h-3.5 w-3.5 text-blue-500" />
                    <span className="text-muted-foreground">Puertos:</span>
                    <span className="font-medium">{eq.numberPorts || '0'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Power className="h-3.5 w-3.5 text-orange-500" />
                    <span className="text-muted-foreground">PoE:</span>
                    <span className="font-medium">{eq.PoE ? "Sí" : "No"}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-10 bg-muted/20 rounded-xl border border-dashed border-border">
          <Info className="h-8 w-8 mx-auto text-muted-foreground/40 mb-2" />
          <p className="text-sm text-muted-foreground">No hay equipos registrados.</p>
        </div>
      )}
    </div>
  );
});
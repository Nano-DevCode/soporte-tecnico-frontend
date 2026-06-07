import { FileSignature, FileText, Info, TicketIcon, User } from "lucide-react"
import { type ItAssetsMovement } from '../interfaces/itAssetsMovementResponse';
import DetailItem from "@/components/custom/DetailItem";

interface Props {
    itAssetMovement: ItAssetsMovement;
}

const ItAssetMovementOutDetails = ({ itAssetMovement }: Props) => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Personal Asignado */}
            {itAssetMovement && (
                <div className="relative overflow-hidden bg-amber-50/50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/50 rounded-xl p-5 transition-all hover:shadow-md">
                    <div className="absolute -right-4 -bottom-4 text-amber-500/5 dark:text-amber-400/5 pointer-events-none">
                        <User className="h-32 w-32" />
                    </div>
                    <div className="relative z-10 flex gap-4 items-start">
                        <div className="bg-amber-100 dark:bg-amber-900/50 p-2.5 rounded-lg shrink-0 shadow-sm border border-amber-200 dark:border-amber-800">
                        <User className="h-6 w-6 text-amber-700 dark:text-amber-400" />
                        </div>
                        <div className="flex-1 space-y-1">
                        <h4 className="text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-widest">
                            Asignado a (Personal)
                        </h4>
                        <p className="text-base font-black text-foreground leading-tight">
                            {itAssetMovement.movementOut?.staff 
                            ? `${itAssetMovement.movementOut.staff.name} ${itAssetMovement.movementOut.staff.paternalSurname} ${itAssetMovement.movementOut.staff.maternalSurname || ""}`.trim()
                            : "Sin personal asignado"
                            }
                        </p>
                        {itAssetMovement.movementOut?.staff && (
                            <p className="text-xs font-mono text-muted-foreground pt-1">
                            N° Control: {itAssetMovement.movementOut.staff.num_control} | RFC: {itAssetMovement.movementOut.staff.rfc}
                            </p>
                        )}
                        </div>
                    </div>
                </div>
            )}

            {/* Estado fisco */}
            <div className="relative overflow-hidden bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/50 rounded-xl p-5 transition-all hover:shadow-md">
                <div className="absolute -right-4 -bottom-4 text-blue-500/5 dark:text-blue-400/5 pointer-events-none">
                    <Info className="h-32 w-32" />
                </div>
                <div className="relative z-10 flex gap-4 items-start">
                    <div className="bg-blue-100 dark:bg-blue-900/50 p-2.5 rounded-lg shrink-0 shadow-sm border border-blue-200 dark:border-blue-800">
                        <Info className="h-6 w-6 text-blue-700 dark:text-blue-400" />
                    </div>
                    <div className="flex-1 space-y-1">
                        <h4 className="text-xs font-bold text-blue-800 dark:text-blue-300 uppercase tracking-widest">
                        Estado Físico al Entregar
                        </h4>
                        <p className="text-base font-black text-foreground leading-tight">
                            {itAssetMovement.movementOut?.itAssetsStatus?.name || "N/A"}
                        </p>
                        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2" title={itAssetMovement.movementOut?.itAssetsStatus?.description}>
                            {itAssetMovement.movementOut?.itAssetsStatus?.description}
                        </p>
                    </div>
                </div>
            </div>
        </div>

            {/* Detalles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8 px-1">
                
                <DetailItem 
                    icon={FileSignature} 
                    label="Folio de Vale" 
                    value={itAssetMovement.movementOut?.voucher || "Sin vale registrado"} 
                />

                {itAssetMovement.movementOut?.ticket && (
                    <DetailItem 
                        icon={TicketIcon} 
                        label="Ticket de Soporte Vinculado" 
                        value={itAssetMovement.movementOut?.ticket?.folio || "No se vinculó a ningún ticket"} 
                    />
                )}
                
                {itAssetMovement.movementOut?.staff && (
                    <div className="sm:col-span-2 border-t border-border/50 pt-6">
                        <DetailItem 
                            icon={FileText} 
                            label="Descripción de Salida" 
                            value={itAssetMovement.movementOut?.description || "Sin descripción."} 
                        />
                    </div>
                )}    

                <div className="sm:col-span-2">
                    <DetailItem 
                        icon={FileText} 
                        label="Observaciones" 
                        value={itAssetMovement.movementOut?.observations || "Sin observaciones adicionales."} 
                        isTextarea 
                    />
                </div>
                
            </div>
        </div>
  )
}

export default ItAssetMovementOutDetails
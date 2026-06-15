import { FileSignature, FileText, Info } from "lucide-react"
import { useTranslation } from "react-i18next";
import { type ItAssetsMovement } from '../interfaces/itAssetsMovementResponse';
import DetailItem from "@/components/custom/DetailItem";
import { TicketDetailsCard } from "@/tickets/components/details/TicketDetailsCard";
import { StaffDetailsCard } from "@/users/components/StaffDetailsCard";

interface Props {
    itAssetMovement: ItAssetsMovement;
}

const ItAssetMovementOutDetails = ({ itAssetMovement }: Props) => {
  const { t } = useTranslation();

  // 1. Extraemos los IDs
  const rawStaff = itAssetMovement.movementOut?.staff;
  const staffId = rawStaff?.id || (typeof rawStaff === 'string' ? rawStaff : undefined);

  const rawTicket = itAssetMovement.movementOut?.ticket;
  const ticketId = rawTicket?.id || (typeof rawTicket === 'string' ? rawTicket : undefined);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <StaffDetailsCard staffId={staffId} />

            {/* TARJETA DE ESTADO FÍSICO */}
            <div className={`relative overflow-hidden bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/50 rounded-xl p-5 transition-all hover:shadow-md ${staffId ? "sm:col-span-1" : "sm:col-span-2"}`}>
                <div className="absolute -right-4 -bottom-4 text-blue-500/5 dark:text-blue-400/5 pointer-events-none">
                    <Info className="h-32 w-32" />
                </div>
                <div className="relative z-10 flex gap-4 items-start">
                    <div className="bg-blue-100 dark:bg-blue-900/50 p-2.5 rounded-lg shrink-0 shadow-sm border border-blue-200 dark:border-blue-800">
                        <Info className="h-6 w-6 text-blue-700 dark:text-blue-400" />
                    </div>
                    <div className="flex-1 space-y-1">
                        <h4 className="text-xs font-bold text-blue-800 dark:text-blue-300 uppercase tracking-widest">
                        {t("itAssets.components.movementOutDetails.statusLabel")}
                        </h4>
                        <p className="text-base font-black text-foreground leading-tight">
                            {itAssetMovement.movementOut?.itAssetsStatus?.name || t("itAssets.components.movementOutDetails.na")}
                        </p>
                        <p className="text-xs text-muted-foreground leading-relaxed" title={itAssetMovement.movementOut?.itAssetsStatus?.description}>
                            {itAssetMovement.movementOut?.itAssetsStatus?.description}
                        </p>
                    </div>
                </div>
            </div>
        </div>

        {/* DETALLES GENERALES */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8 px-1">
            
            <DetailItem 
                icon={FileSignature} 
                label={t("itAssets.components.movementOutDetails.voucherLabel")} 
                value={itAssetMovement.movementOut?.voucher || t("itAssets.components.movementOutDetails.noVoucher")} 
            />

            {/* TARIJETA DEL TICKET (Componente Separado) */}
            <TicketDetailsCard
                ticketId={ticketId} 
                fallbackFolio={rawTicket?.folio} 
            />
            
            {/* DESCRIPCIÓN DEL MOVIMIENTO */}
            {staffId && (
                <div className="sm:col-span-2 border-t border-border/50 pt-6">
                    <DetailItem 
                        icon={FileText} 
                        label={t("itAssets.components.movementOutDetails.descriptionLabel")} 
                        value={itAssetMovement.movementOut?.description || t("itAssets.components.movementOutDetails.noDescription")} 
                        isTextarea 
                    />
                </div>
            )}    

            {/* OBSERVACIONES DEL MOVIMIENTO */}
            <div className="sm:col-span-2">
                <DetailItem 
                    icon={FileText} 
                    label={t("itAssets.components.movementOutDetails.observationsLabel")} 
                    value={itAssetMovement.movementOut?.observations || t("itAssets.components.movementOutDetails.noObservations")} 
                    isTextarea 
                />
            </div>
            
        </div>
    </div>
  )
}

export default ItAssetMovementOutDetails;
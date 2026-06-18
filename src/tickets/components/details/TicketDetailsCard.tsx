import { TicketIcon, User, MapPin, Activity, Loader2, Clock, Building, Wrench, FileText } from "lucide-react";
import { useTranslation } from "react-i18next";
import DetailItem from "@/components/custom/DetailItem";

// Ajusta esta ruta a donde esté tu hook
import { useGetTicketById } from "@/tickets/hooks/useGetTicketById"; 

interface TicketDetailsCardProps {
  ticketId?: string;
  fallbackFolio?: string;
}

export const TicketDetailsCard = ({ ticketId, fallbackFolio }: TicketDetailsCardProps) => {
  const { t } = useTranslation();
  
  // El hook hace la petición solo si existe el ticketId 
  const { data: fullTicket, isLoading: isLoadingTicket } = useGetTicketById(ticketId);

  if (!ticketId) return null;

  return (
    <div className="sm:col-span-2 space-y-4 border-t border-border/50 pt-6">
        <DetailItem 
            icon={TicketIcon} 
            label={t("itAssets.components.movementOutDetails.ticketLabel", "Ticket Asociado")} 
            value={fullTicket?.folio || fallbackFolio || t("itAssets.components.movementOutDetails.noTicket", "Sin Ticket")} 
        />
        
        {isLoadingTicket ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/10 p-4 rounded-lg border border-border/50">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                {t("tickets.components.ticketDetailsCard.loading")}
            </div>
        ) : fullTicket ? (
            <div className="flex flex-col gap-6 bg-muted/10 p-5 rounded-xl border border-border/50">
                
                {/* Header del Ticket */}
                <div className="border-b border-border/40 pb-3 flex justify-between items-center">
                    <div>
                        <span className="text-xs font-bold text-primary uppercase tracking-widest block">
                            {t("tickets.components.ticketDetailsCard.headerTitle")}
                        </span>
                        <span className="text-sm font-semibold text-foreground">
                            {fullTicket.issue_type?.name || t("tickets.components.ticketDetailsCard.unclassified")}
                        </span>
                    </div>
                    <span className="bg-primary/10 text-primary px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest border border-primary/20">
                        {t("tickets.components.ticketDetailsCard.status")}: {fullTicket.currentStatusCode}
                    </span>
                </div>

                {/* Grid Principal del Ticket */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <DetailItem 
                        icon={User} 
                        label={t("tickets.components.ticketDetailsCard.fields.affected")} 
                        value={fullTicket.affected_name} 
                    />
                    <DetailItem 
                        icon={MapPin} 
                        label={t("tickets.components.ticketDetailsCard.fields.location")} 
                        value={fullTicket.equipment_location} 
                    />
                    <DetailItem 
                        icon={Activity} 
                        label={t("tickets.components.ticketDetailsCard.fields.priority")} 
                        value={`${t("tickets.components.ticketDetailsCard.fields.level")} ${fullTicket.priority}`} 
                    />
                    <DetailItem 
                        icon={Clock} 
                        label={t("tickets.components.ticketDetailsCard.fields.schedule")} 
                        value={fullTicket.available_hours || t("tickets.components.ticketDetailsCard.fields.na")} 
                    />
                    
                    {/* Descripción Original del Ticket */}
                    <div className="sm:col-span-2 mt-2">
                        <DetailItem 
                            icon={FileText} 
                            label={t("tickets.components.ticketDetailsCard.fields.description")} 
                            value={fullTicket.description} 
                            isTextarea 
                        />
                    </div>
                </div>

                {/* Responsables (Jefe / Técnicos) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-border/40 pt-4 mt-2">
                    {fullTicket.jefe_depto && (
                        <DetailItem 
                            icon={Building} 
                            label={t("tickets.components.ticketDetailsCard.fields.boss")} 
                            value={`${fullTicket.jefe_depto.name} ${fullTicket.jefe_depto.paternalSurname}`}
                            subValue={fullTicket.jefe_depto.department?.name} 
                        />
                    )}

                    {fullTicket.attends && fullTicket.attends.length > 0 && (
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <Wrench className="h-3.5 w-3.5 text-muted-foreground/70" />
                                <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                                    {t("tickets.components.ticketDetailsCard.fields.technicians")}
                                </span>
                            </div>
                            <div className="flex flex-col gap-1 pl-1 text-sm font-semibold">
                                {fullTicket.attends.map(att => (
                                    <span key={att.id} className={att.is_active ? "text-foreground" : "text-muted-foreground line-through"}>
                                        • {att.technician.name} {att.technician.paternalSurname}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        ) : null}
    </div>
  );
};

export default TicketDetailsCard;
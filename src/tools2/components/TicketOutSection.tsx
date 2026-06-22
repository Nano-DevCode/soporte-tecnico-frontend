import { useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { Ticket, Info, Calendar, AlertCircle, Clock, Mail, Building2 } from "lucide-react";
import { useTranslation } from "react-i18next";

// Hooks
import { useTicketsAssignedes } from "../hooks/useTicketsAssignedes";

// UI Components
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { TicketsAssignedesResponse } from "../interfaces/ticketAssignedes.interce";

interface Props {
  isDisabled: boolean;
}

export const TicketOutSection = ({ isDisabled }: Props) => {
  const { t } = useTranslation();
  const { control, watch } = useFormContext();
  const { tickets, isLoading: isLoadingTickets } = useTicketsAssignedes();

  const currentTicketId = watch("tikedId");
  
  const selectedTicket: TicketsAssignedesResponse | null | undefined = useMemo(() => {
    if (!currentTicketId || !tickets) return null;
    return tickets.find((ticket) => ticket.id === currentTicketId);
  }, [tickets, currentTicketId]);

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
      <FormField
        control={control}
        name="tikedId"
        render={({ field }) => (
          <FormItem className="w-full">
            <FormLabel className="flex items-center gap-2">
              <Ticket className="h-4 w-4 text-muted-foreground" />
              {t("tools.components.ticketOutSection.label")} <span className="text-red-500">*</span>
            </FormLabel>
            <Select onValueChange={field.onChange} value={field.value} disabled={isLoadingTickets || isDisabled}>
              <FormControl>
                {/* AQUÍ AGREGAMOS w-full PARA QUE OCUPE TODO A LO ANCHO */}
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t("tools.components.ticketOutSection.placeholder")} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {tickets?.map((ticket) => (
                  <SelectItem key={ticket.id} value={ticket.id}>
                    {ticket.folio} - {ticket.issue_type?.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* PREVIEW ENRIQUECIDO DEL TICKET */}
            {selectedTicket && (
              <div className="mt-4 rounded-lg border border-primary/20 bg-primary/5 p-4 md:p-5 shadow-sm">
                
                {/* Cabecera del Preview */}
                <div className="flex items-center justify-between border-b border-primary/10 pb-3 mb-4">
                  <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <Info className="h-4 w-4 text-primary" />
                    {t("tools.components.ticketOutSection.previewTitle")}
                  </h4>
                  <span className="bg-primary/10 text-primary px-2.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider">
                    {selectedTicket.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-5 gap-x-4 text-xs">
                  
                  {/* Folio */}
                  <div>
                    <span className="block font-semibold text-muted-foreground mb-1">
                      {t("tools.components.ticketOutSection.folio")}
                    </span>
                    <span className="inline-flex items-center rounded-md bg-background px-2.5 py-1 text-xs font-mono font-medium text-foreground border border-border shadow-sm">
                      {selectedTicket.folio}
                    </span>
                  </div>

                  {/* Fecha de Creación */}
                  <div>
                    <span className="flex items-center gap-1.5 font-semibold text-muted-foreground mb-1">
                      <Calendar className="h-3.5 w-3.5" /> {t("tools.components.ticketOutSection.createdAt")}
                    </span>
                    <p className="text-foreground font-medium pl-5">
                      {new Date(selectedTicket.created_at).toLocaleDateString("es-MX", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </p>
                  </div>

                  {/* Prioridad */}
                  <div>
                    <span className="flex items-center gap-1.5 font-semibold text-muted-foreground mb-1">
                      <AlertCircle className="h-3.5 w-3.5" /> {t("tools.components.ticketOutSection.priority")}
                    </span>
                    <p className="text-foreground font-medium pl-5">
                      {t("tools.components.ticketOutSection.level")} {selectedTicket.priority}
                    </p>
                  </div>

                  {/* Tipo de problema */}
                  <div>
                    <span className="block font-semibold text-muted-foreground mb-1">
                      {t("tools.components.ticketOutSection.issueType")}
                    </span>
                    <p className="text-foreground font-medium">{selectedTicket.issue_type?.name}</p>
                  </div>

                  {/* Periodo Escolar */}
                  <div className="sm:col-span-2 lg:col-span-2">
                    <span className="flex items-center gap-1.5 font-semibold text-muted-foreground mb-1">
                      <Clock className="h-3.5 w-3.5" /> {t("tools.components.ticketOutSection.schoolPeriod")}
                    </span>
                    <p className="text-foreground font-medium pl-5">{selectedTicket.school_period?.name}</p>
                  </div>

                  {/* Reportado por */}
                  <div className="sm:col-span-2 lg:col-span-3 bg-background/50 p-3.5 rounded-md border border-border/50 mt-1">
                    <span className="block font-semibold text-muted-foreground mb-2">
                      {t("tools.components.ticketOutSection.reportedBy")}
                    </span>
                    <div className="flex flex-col gap-1.5">
                      <p className="text-base text-foreground font-bold leading-none">
                        {selectedTicket.jefe_depto?.full_name}
                      </p>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-1">
                        <span className="flex items-center gap-1.5 text-muted-foreground font-medium">
                          <Building2 className="h-3.5 w-3.5" /> 
                          {selectedTicket.jefe_depto?.department?.name}
                        </span>
                        <span className="flex items-center gap-1.5 text-muted-foreground">
                          <Mail className="h-3.5 w-3.5" /> 
                          {selectedTicket.jefe_depto?.email}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Descripción */}
                  <div className="sm:col-span-2 lg:col-span-3 mt-1">
                    <span className="block font-semibold text-muted-foreground mb-2">
                      {t("tools.components.ticketOutSection.description")}
                    </span>
                    <p className="text-foreground italic bg-background p-3.5 rounded-md border border-border/50 whitespace-pre-wrap leading-relaxed shadow-inner">
                      "{selectedTicket.description}"
                    </p>
                  </div>

                </div>
              </div>
            )}
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
import { useSearchParams, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { Timer, ArrowUpRight, Filter, CheckCircle2 } from "lucide-react";
import { CustomTitleCard } from "@/components/custom/CustomTitleCard";
import { SlaMetricsSummaryCard } from "../components/SlaMetricsSummaryCard";
import { SlaStatusBadge } from "../components/SlaStatusBadge";
import { SlaProgressBar } from "../components/SlaProgressBar";
import { useSlaMetrics, useSlaTickets } from "../hooks/useSlaMonitoring";
import { CustomPagination } from "@/components/custom/CustomPagination";
import { CustomEmptyListState } from "@/components/custom/CustomEmptyListState";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { SlaStatusType } from "../interfaces/sla.interfaces";
import { format } from "date-fns";
import { es, enUS } from "date-fns/locale";

export const SlaMonitoringPage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const status = (searchParams.get("status") as SlaStatusType | null) || undefined;
  const priority = searchParams.get("priority")
    ? parseInt(searchParams.get("priority")!, 10)
    : undefined;

  const { data: metrics, isLoading: isMetricsLoading } = useSlaMetrics();
  const { data: ticketsData, isLoading: isTicketsLoading } = useSlaTickets({
    page,
    limit,
    status,
    priority,
  });

  const handleStatusFilter = (val: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (val === "ALL") {
      newParams.delete("status");
    } else {
      newParams.set("status", val);
    }
    newParams.set("page", "1");
    setSearchParams(newParams);
  };

  const handlePriorityFilter = (val: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (val === "ALL") {
      newParams.delete("priority");
    } else {
      newParams.set("priority", val);
    }
    newParams.set("page", "1");
    setSearchParams(newParams);
  };

  const dateLocale = i18n.language.startsWith("en") ? enUS : es;

  return (
    <div className="space-y-6">
      {/* Cabecera */}
      <CustomTitleCard
        title={t("sla.monitoring.title", "Monitoreo Proactivo de SLA")}
        description={t(
          "sla.monitoring.description",
          "Supervisión en tiempo real de acuerdos de nivel de servicio, tickets en riesgo de vencimiento y plazos de atención."
        )}
        icon={Timer}
      />

      {/* Métricas Principales */}
      <SlaMetricsSummaryCard
        metrics={metrics}
        isLoading={isMetricsLoading}
        canEvaluate={true}
      />

      {/* Filtros y Listado de Tickets */}
      <Card className="shadow-sm">
        <CardContent className="pt-6 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-semibold">
                {t("sla.filters.title", "Tickets en Seguimiento")}
              </span>
              {ticketsData?.meta && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">
                  {ticketsData.meta.total}
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              {/* Filtro por Estado SLA */}
              <Select
                value={status || "ALL"}
                onValueChange={handleStatusFilter}
              >
                <SelectTrigger className="w-[170px] h-9 text-xs">
                  <SelectValue placeholder={t("sla.filters.status", "Estado SLA")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">{t("sla.filters.all_status", "Todos los estados")}</SelectItem>
                  <SelectItem value="AT_RISK">{t("sla.filters.at_risk", "En Riesgo")}</SelectItem>
                  <SelectItem value="BREACHED">{t("sla.filters.breached", "Vencidos")}</SelectItem>
                  <SelectItem value="ON_TRACK">{t("sla.filters.on_track", "En Plazo")}</SelectItem>
                </SelectContent>
              </Select>

              {/* Filtro por Prioridad */}
              <Select
                value={priority ? priority.toString() : "ALL"}
                onValueChange={handlePriorityFilter}
              >
                <SelectTrigger className="w-[150px] h-9 text-xs">
                  <SelectValue placeholder={t("sla.filters.priority", "Prioridad")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">{t("sla.filters.all_priorities", "Todas")}</SelectItem>
                  <SelectItem value="1">{t("sla.priority.critical", "1 - Crítica")}</SelectItem>
                  <SelectItem value="2">{t("sla.priority.high", "2 - Alta")}</SelectItem>
                  <SelectItem value="3">{t("sla.priority.medium", "3 - Media")}</SelectItem>
                  <SelectItem value="4">{t("sla.priority.low", "4 - Baja")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tabla de Tickets SLA */}
          {isTicketsLoading ? (
            <div className="space-y-3 py-6 animate-pulse">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-14 w-full bg-muted/40 rounded-lg" />
              ))}
            </div>
          ) : !ticketsData?.data || ticketsData.data.length === 0 ? (
            <div className="py-12">
              <CustomEmptyListState
                icon={CheckCircle2}
                title={t("sla.empty.title", "Sin tickets con riesgo de SLA")}
                description={t(
                  "sla.empty.description",
                  "No hay tickets que coincidan con los filtros seleccionados o todos los tickets activos se encuentran dentro de los tiempos estipulados."
                )}
              />
            </div>
          ) : (
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[130px]">{t("sla.table.folio", "Folio")}</TableHead>
                    <TableHead>{t("sla.table.department", "Departamento")}</TableHead>
                    <TableHead className="w-[110px]">{t("sla.table.priority", "Prioridad")}</TableHead>
                    <TableHead className="w-[130px]">{t("sla.table.status", "Estado SLA")}</TableHead>
                    <TableHead className="w-[220px]">{t("sla.table.progress", "Tiempo Consumido")}</TableHead>
                    <TableHead className="w-[170px]">{t("sla.table.deadline", "Límite Estimado")}</TableHead>
                    <TableHead className="text-right w-[100px]">{t("common_actions", "Acciones")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ticketsData.data.map((ticket) => (
                    <TableRow key={ticket.ticketId}>
                      <TableCell className="font-semibold text-primary">
                        {ticket.folio}
                      </TableCell>
                      <TableCell>
                        <p className="text-sm font-medium">{ticket.departmentName}</p>
                        {ticket.technicians && ticket.technicians.length > 0 && (
                          <p className="text-xs text-muted-foreground">
                            {ticket.technicians.join(", ")}
                          </p>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-muted text-foreground">
                          {ticket.priorityLabel || `P${ticket.priority}`}
                        </span>
                      </TableCell>
                      <TableCell>
                        <SlaStatusBadge status={ticket.slaStatus} />
                      </TableCell>
                      <TableCell>
                        <SlaProgressBar
                          percentage={ticket.percentageConsumed}
                          remainingHours={ticket.remainingHours}
                          maxHours={ticket.maxResolutionHours}
                          status={ticket.slaStatus}
                        />
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {ticket.resolutionDeadline
                          ? format(new Date(ticket.resolutionDeadline), "dd MMM yyyy, HH:mm", {
                              locale: dateLocale,
                            })
                          : "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/tickets/${ticket.ticketId}`)}
                          className="gap-1 h-8 px-2.5"
                        >
                          <span>{t("sla.table.view", "Ver")}</span>
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Paginación */}
          {ticketsData?.meta && ticketsData.meta.totalPages > 1 && (
            <div className="pt-2">
              <CustomPagination totalPages={ticketsData.meta.totalPages} />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SlaMonitoringPage;


import { useState } from "react";
import { useSearchParams } from "react-router";
import { useTranslation } from "react-i18next";
import {
  History,
  Filter,
  Eye,
  CheckCircle2,
  Database,
} from "lucide-react";
import { CustomTitleCard } from "@/components/custom/CustomTitleCard";
import { AuditActionBadge } from "../components/AuditActionBadge";
import { AuditDiffDialog } from "../components/AuditDiffDialog";
import { useAuditLogs } from "../hooks/useAuditLogs";
import type { AuditLog, AuditActionType } from "../interfaces/audit.interfaces";
import { CustomPagination } from "@/components/custom/CustomPagination";
import { CustomEmptyListState } from "@/components/custom/CustomEmptyListState";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import { format } from "date-fns";
import { es, enUS } from "date-fns/locale";

export const AuditLogsPage = () => {
  const { t, i18n } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [isDiffOpen, setIsDiffOpen] = useState(false);

  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const offset = (page - 1) * limit;

  const entityName = searchParams.get("entityName") || undefined;
  const entityId = searchParams.get("entityId") || undefined;
  const action = (searchParams.get("action") as AuditActionType | null) || undefined;

  const { data: logsData, isLoading } = useAuditLogs({
    limit,
    offset,
    entityName,
    entityId,
    action,
  });

  const handleEntityFilter = (val: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (val === "ALL") {
      newParams.delete("entityName");
    } else {
      newParams.set("entityName", val);
    }
    newParams.set("page", "1");
    setSearchParams(newParams);
  };

  const handleActionFilter = (val: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (val === "ALL") {
      newParams.delete("action");
    } else {
      newParams.set("action", val);
    }
    newParams.set("page", "1");
    setSearchParams(newParams);
  };

  const handleSearchEntityId = (val: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (!val.trim()) {
      newParams.delete("entityId");
    } else {
      newParams.set("entityId", val.trim());
    }
    newParams.set("page", "1");
    setSearchParams(newParams);
  };

  const openDiff = (log: AuditLog) => {
    setSelectedLog(log);
    setIsDiffOpen(true);
  };

  const dateLocale = i18n.language.startsWith("en") ? enUS : es;

  return (
    <div className="space-y-6">
      <CustomTitleCard
        title={t("audit.page.title", "Trazabilidad y Auditoría Global")}
        description={t(
          "audit.page.description",
          "Historial inmutable de cambios y modificaciones del sistema capturadas mediante Change Data Capture (CDC)."
        )}
        icon={History}
      />

      <Card className="shadow-sm">
        <CardContent className="pt-6 space-y-4">
          {/* Barra de Filtros */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-semibold">
                {t("audit.filters.title", "Filtros de Trazabilidad")}
              </span>
              {logsData?.meta && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">
                  {logsData.meta.total} registros
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              {/* Búsqueda por ID de entidad */}
              <Input
                placeholder={t("audit.filters.search_id", "Buscar por ID...")}
                defaultValue={entityId || ""}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearchEntityId(e.currentTarget.value);
                  }
                }}
                className="w-full sm:w-[190px] h-9 text-xs"
              />

              {/* Filtro por Entidad */}
              <Select
                value={entityName || "ALL"}
                onValueChange={handleEntityFilter}
              >
                <SelectTrigger className="w-[160px] h-9 text-xs">
                  <SelectValue placeholder="Entidad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Todas las entidades</SelectItem>
                  <SelectItem value="Ticket">Ticket</SelectItem>
                  <SelectItem value="User">Usuario</SelectItem>
                  <SelectItem value="Equipment">Equipo</SelectItem>
                  <SelectItem value="Department">Departamento</SelectItem>
                  <SelectItem value="TechnicalReport">Reporte Técnico</SelectItem>
                  <SelectItem value="SchoolPeriod">Periodo Escolar</SelectItem>
                </SelectContent>
              </Select>

              {/* Filtro por Acción */}
              <Select
                value={action || "ALL"}
                onValueChange={handleActionFilter}
              >
                <SelectTrigger className="w-[140px] h-9 text-xs">
                  <SelectValue placeholder="Acción" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Todas las acciones</SelectItem>
                  <SelectItem value="CREATE">Creación</SelectItem>
                  <SelectItem value="UPDATE">Modificación</SelectItem>
                  <SelectItem value="DELETE">Eliminación</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tabla de Registros */}
          {isLoading ? (
            <div className="space-y-3 py-6 animate-pulse">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-12 w-full bg-muted/40 rounded-lg" />
              ))}
            </div>
          ) : !logsData?.data || logsData.data.length === 0 ? (
            <div className="py-12">
              <CustomEmptyListState
                icon={CheckCircle2}
                title={t("audit.empty.title", "No hay registros de auditoría")}
                description={t(
                  "audit.empty.description",
                  "No se encontraron modificaciones que coincidan con los criterios de búsqueda especificados."
                )}
              />
            </div>
          ) : (
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[170px]">Fecha / Hora</TableHead>
                    <TableHead className="w-[130px]">Acción</TableHead>
                    <TableHead className="w-[150px]">Entidad</TableHead>
                    <TableHead>Registro ID</TableHead>
                    <TableHead>Realizado por</TableHead>
                    <TableHead className="w-[130px]">Dirección IP</TableHead>
                    <TableHead className="text-right w-[100px]">Detalle</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logsData.data.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                        {format(new Date(log.createdAt), "dd MMM yyyy, HH:mm:ss", {
                          locale: dateLocale,
                        })}
                      </TableCell>
                      <TableCell>
                        <AuditActionBadge action={log.action} />
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-semibold bg-muted text-foreground">
                          <Database className="h-3 w-3 text-muted-foreground" />
                          {log.entityName}
                        </span>
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground truncate max-w-[140px]">
                        {log.entityId}
                      </TableCell>
                      <TableCell className="text-xs">
                        <span className="font-medium text-foreground">
                          {log.performedByEmail || "Sistema / Anónimo"}
                        </span>
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {log.ipAddress || "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openDiff(log)}
                          className="gap-1.5 h-8 px-2.5"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          <span>Ver</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Paginación */}
          {logsData?.meta && logsData.meta.lastPage > 1 && (
            <div className="pt-2">
              <CustomPagination totalPages={logsData.meta.lastPage} />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de Diferencias */}
      <AuditDiffDialog
        log={selectedLog}
        open={isDiffOpen}
        onOpenChange={setIsDiffOpen}
      />
    </div>
  );
};

export default AuditLogsPage;


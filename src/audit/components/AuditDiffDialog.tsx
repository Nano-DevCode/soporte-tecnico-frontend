import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AuditActionBadge } from "./AuditActionBadge";
import type { AuditLog } from "../interfaces/audit.interfaces";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { History, User, Globe, Hash, Clock, FileCode } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Props {
  log: AuditLog | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AuditDiffDialog = ({ log, open, onOpenChange }: Props) => {
  if (!log) return null;

  const changedFields = log.changedFields || [];
  const hasDiff = changedFields.length > 0;

  const formatValue = (val: unknown): string => {
    if (val === null || val === undefined) return "null";
    if (typeof val === "object") return JSON.stringify(val, null, 2);
    return String(val);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col p-6">
        <DialogHeader className="border-b pb-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <History className="h-5 w-5 text-muted-foreground" />
              <DialogTitle className="text-lg">
                Auditoría: {log.entityName}
              </DialogTitle>
            </div>
            <AuditActionBadge action={log.action} />
          </div>
          <DialogDescription className="text-xs">
            Registro ID: <span className="font-mono">{log.entityId}</span>
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-6 pt-4">
            {/* Metadatos de la Operación */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-3.5 rounded-lg border bg-muted/20 text-xs">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground shrink-0" />
                <div className="truncate">
                  <span className="text-muted-foreground block text-[10px]">Realizado por</span>
                  <span className="font-medium truncate">{log.performedByEmail || "Sistema / Anónimo"}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
                <div>
                  <span className="text-muted-foreground block text-[10px]">Fecha y Hora</span>
                  <span className="font-medium">
                    {format(new Date(log.createdAt), "dd MMM yyyy, HH:mm:ss", { locale: es })}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-muted-foreground shrink-0" />
                <div>
                  <span className="text-muted-foreground block text-[10px]">Dirección IP</span>
                  <span className="font-mono font-medium">{log.ipAddress || "N/D"}</span>
                </div>
              </div>

              {log.requestId && (
                <div className="flex items-center gap-2 sm:col-span-2">
                  <Hash className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div className="truncate">
                    <span className="text-muted-foreground block text-[10px]">Request ID</span>
                    <span className="font-mono text-[11px] truncate">{log.requestId}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Comparación de Campos Modificados */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold flex items-center gap-2">
                <FileCode className="h-4 w-4 text-primary" />
                <span>Campos Modificados ({changedFields.length})</span>
              </h4>

              {hasDiff ? (
                <div className="space-y-3">
                  {changedFields.map((field) => {
                    const prev = log.previousValues?.[field];
                    const next = log.newValues?.[field];

                    return (
                      <div
                        key={field}
                        className="rounded-lg border overflow-hidden text-xs bg-card"
                      >
                        <div className="bg-muted/40 px-3 py-1.5 font-mono font-semibold text-foreground border-b">
                          {field}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x">
                          <div className="p-3 bg-rose-500/5">
                            <span className="block text-[10px] uppercase font-bold text-rose-600 dark:text-rose-400 mb-1">
                              Valor Anterior
                            </span>
                            <pre className="whitespace-pre-wrap font-mono text-[11px] text-muted-foreground">
                              {formatValue(prev)}
                            </pre>
                          </div>
                          <div className="p-3 bg-emerald-500/5">
                            <span className="block text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 mb-1">
                              Nuevo Valor
                            </span>
                            <pre className="whitespace-pre-wrap font-mono text-[11px] text-foreground">
                              {formatValue(next)}
                            </pre>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-4 rounded-lg border bg-muted/20 text-center text-xs text-muted-foreground">
                  {log.action === "CREATE"
                    ? "Registro inicial creado. Consulta los nuevos valores a continuación."
                    : "No se identificaron diferencias individuales en atributos simples."}
                </div>
              )}
            </div>

            {/* Valores Completos en JSON (para CREATE o inspección exhaustiva) */}
            {log.newValues && (
              <details className="text-xs group border rounded-lg p-3 bg-muted/10">
                <summary className="font-semibold cursor-pointer text-muted-foreground hover:text-foreground">
                  Ver payload completo (JSON)
                </summary>
                <pre className="mt-2 p-3 rounded bg-zinc-950 text-zinc-100 font-mono text-[11px] overflow-x-auto max-h-60">
                  {JSON.stringify(log.newValues, null, 2)}
                </pre>
              </details>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};


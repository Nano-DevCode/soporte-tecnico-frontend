import { useQuery } from "@tanstack/react-query";
import {
  getAuditLogsAction,
  getEntityAuditLogsAction,
} from "../actions/audit.actions";
import type { FilterAuditLogsParams } from "../interfaces/audit.interfaces";

export const auditQueryKeys = {
  all: ["audit-logs"] as const,
  list: (params?: FilterAuditLogsParams) => [...auditQueryKeys.all, "list", params] as const,
  entity: (entityName: string, entityId: string) =>
    [...auditQueryKeys.all, "entity", entityName, entityId] as const,
};

export const useAuditLogs = (params?: FilterAuditLogsParams) => {
  return useQuery({
    queryKey: auditQueryKeys.list(params),
    queryFn: () => getAuditLogsAction(params),
    placeholderData: (prev) => prev,
  });
};

export const useEntityAuditLogs = (entityName: string, entityId: string) => {
  return useQuery({
    queryKey: auditQueryKeys.entity(entityName, entityId),
    queryFn: () => getEntityAuditLogsAction(entityName, entityId),
    enabled: Boolean(entityName && entityId),
  });
};


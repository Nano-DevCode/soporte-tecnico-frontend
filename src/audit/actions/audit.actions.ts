import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";
import type {
  AuditLog,
  AuditLogsResponse,
  FilterAuditLogsParams,
} from "../interfaces/audit.interfaces";
import { logError } from "@/utils/logger";

export const getAuditLogsAction = async (
  params?: FilterAuditLogsParams
): Promise<AuditLogsResponse> => {
  try {
    const { data } = await soporteTecnicoApi.get<AuditLogsResponse>("/audit-logs", {
      params,
    });
    return data;
  } catch (error) {
    logError(error, "getAuditLogsAction", "Error al obtener registros de auditoría");
    throw error;
  }
};

export const getEntityAuditLogsAction = async (
  entityName: string,
  entityId: string
): Promise<AuditLog[]> => {
  try {
    const { data } = await soporteTecnicoApi.get<AuditLog[]>(
      `/audit-logs/entity/${entityName}/${entityId}`
    );
    return data;
  } catch (error) {
    logError(error, "getEntityAuditLogsAction", `Error al obtener auditoría de ${entityName}`);
    throw error;
  }
};

export const getAuditLogByIdAction = async (id: string): Promise<AuditLog> => {
  try {
    const { data } = await soporteTecnicoApi.get<AuditLog>(`/audit-logs/${id}`);
    return data;
  } catch (error) {
    logError(error, "getAuditLogByIdAction", "Error al obtener detalle de auditoría");
    throw error;
  }
};


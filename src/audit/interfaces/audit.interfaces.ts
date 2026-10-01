export type AuditActionType = 'CREATE' | 'UPDATE' | 'DELETE';

export interface AuditLog {
  id: string;
  entityName: string;
  entityId: string;
  action: AuditActionType;
  performedBy: string | null;
  performedByEmail: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  requestId: string | null;
  previousValues: Record<string, unknown> | null;
  newValues: Record<string, unknown> | null;
  changedFields: string[] | null;
  createdAt: string;
}

export interface AuditLogsResponse {
  data: AuditLog[];
  meta: {
    total: number;
    page: number;
    lastPage: number;
  };
}

export interface FilterAuditLogsParams {
  limit?: number;
  offset?: number;
  entityName?: string;
  entityId?: string;
  action?: AuditActionType;
  performedBy?: string;
  startDate?: string;
  endDate?: string;
}


export type SlaStatusType = 'ON_TRACK' | 'AT_RISK' | 'BREACHED' | 'COMPLIANT';

export interface SlaPriorityBreakdown {
  priority: number;
  label: string;
  total: number;
  onTrack: number;
  atRisk: number;
  breached: number;
}

export interface SlaMetricsResponse {
  totalActive: number;
  onTrack: number;
  atRisk: number;
  breached: number;
  compliancePercentage: number;
  byPriority: SlaPriorityBreakdown[];
}

export interface SlaTicketItem {
  ticketId: string;
  folio: string;
  priority: number;
  priorityLabel: string;
  status: string;
  departmentName: string;
  maxResolutionHours: number;
  elapsedHours: number;
  remainingHours: number;
  percentageConsumed: number;
  slaStatus: SlaStatusType;
  coordinatorName?: string;
  technicians?: string[];
  createdAt: string;
  resolutionDeadline: string;
}

export interface SlaTicketsResponse {
  data: SlaTicketItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface EvaluateSlaResponse {
  checked: number;
  onTrack: number;
  atRisk: number;
  breached: number;
  warningAlertsSent: number;
  breachAlertsSent: number;
}

export interface SlaFilterParams {
  page?: number;
  limit?: number;
  status?: SlaStatusType;
  priority?: number;
}


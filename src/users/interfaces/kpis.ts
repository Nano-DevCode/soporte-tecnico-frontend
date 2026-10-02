import type { TicketCheck } from "lucide-react";

export interface MetricProps {
  icon: typeof TicketCheck;
  label: string;
  value: number | string;
  tone?: KpiTone;
}

export interface KpiTone {
  label: string;
  border: string;
  avatar: string;
  badge: string;
  text: string;
  progress: string;
  bar?: string;
  surface: string;
}
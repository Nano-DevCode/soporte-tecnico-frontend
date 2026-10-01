import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";
import type {
  SlaMetricsResponse,
  SlaTicketsResponse,
  EvaluateSlaResponse,
  SlaFilterParams,
} from "../interfaces/sla.interfaces";
import { logError } from "@/utils/logger";

export const getSlaMetricsAction = async (): Promise<SlaMetricsResponse> => {
  try {
    const { data } = await soporteTecnicoApi.get<SlaMetricsResponse>("/sla/metrics");
    return data;
  } catch (error) {
    logError(error, "getSlaMetricsAction", "Error al obtener métricas de SLA");
    throw error;
  }
};

export const getSlaTicketsAction = async (
  params?: SlaFilterParams
): Promise<SlaTicketsResponse> => {
  try {
    const { data } = await soporteTecnicoApi.get<SlaTicketsResponse>("/sla/tickets", {
      params,
    });
    return data;
  } catch (error) {
    logError(error, "getSlaTicketsAction", "Error al obtener tickets de SLA");
    throw error;
  }
};

export const evaluateSlaAction = async (): Promise<EvaluateSlaResponse> => {
  try {
    const { data } = await soporteTecnicoApi.post<EvaluateSlaResponse>("/sla/evaluate");
    return data;
  } catch (error) {
    logError(error, "evaluateSlaAction", "Error al evaluar SLA");
    throw error;
  }
};


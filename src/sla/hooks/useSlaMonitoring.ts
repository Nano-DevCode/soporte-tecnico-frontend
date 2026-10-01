import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getSlaMetricsAction,
  getSlaTicketsAction,
  evaluateSlaAction,
} from "../actions/sla.actions";
import type { SlaFilterParams } from "../interfaces/sla.interfaces";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export const slaQueryKeys = {
  all: ["sla"] as const,
  metrics: () => [...slaQueryKeys.all, "metrics"] as const,
  tickets: (params?: SlaFilterParams) => [...slaQueryKeys.all, "tickets", params] as const,
};

export const useSlaMetrics = () => {
  return useQuery({
    queryKey: slaQueryKeys.metrics(),
    queryFn: getSlaMetricsAction,
    refetchInterval: 60 * 1000,
  });
};

export const useSlaTickets = (params?: SlaFilterParams) => {
  return useQuery({
    queryKey: slaQueryKeys.tickets(params),
    queryFn: () => getSlaTicketsAction(params),
    placeholderData: (prev) => prev,
    refetchInterval: 60 * 1000,
  });
};

export const useEvaluateSla = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: evaluateSlaAction,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: slaQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });

      toast.success(
        t("sla.evaluate.success", "Ciclo de evaluación de SLA completado"),
        {
          description: t("sla.evaluate.summary", {
            defaultValue: `${data.checked} revisados: ${data.onTrack} en plazo, ${data.atRisk} en riesgo, ${data.breached} vencidos.`,
          }),
        }
      );
    },
    onError: () => {
      toast.error(t("sla.evaluate.error", "No se pudo ejecutar la evaluación de SLA"));
    },
  });
};

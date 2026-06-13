import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router";
import { getBatchesProductsAction } from "../actions/get-batches-consumables";

export const useBatchesConsumables = () => {
  const [searchParams] = useSearchParams();

  // Leer filtros y paginación desde la URL
  const search = searchParams.get("search") || "";
  const page = Math.max(1, Number(searchParams.get("page") || "1"));
  const limit = Number(searchParams.get("limit") || "2"); // Un número par para grillas balanceadas
  const offset = (page - 1) * limit;

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["batches-products", { search, limit, offset }],
    queryFn: () => getBatchesProductsAction({ search, limit, offset }),
  });

  // Helper para formatear fechas a México (Formato: 08/06/2026 09:30 AM)
  const formatDateToMexico = (isoString: string): string => {
    if (!isoString) return "Sin fecha";
    try {
      const date = new Date(isoString);
      return new Intl.DateTimeFormat("es-MX", {
        timeZone: "America/Mexico_City",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }).format(date);
    } catch {
      return "Fecha inválida";
    }
  };

  // Mapeamos los datos inyectando la fecha formateada localmente
  const processedBatches = (data?.data || []).map((batch) => ({
    ...batch,
    formatted_created_at: formatDateToMexico(batch.created_at),
    formatted_updated_at: formatDateToMexico(batch.updated_at),
  }));

  return {
    batches: processedBatches,
    meta: data?.meta || { total: 0, page: 1, lastPage: 1 },
    isLoading,
    isError,
    refetch,
  };
};
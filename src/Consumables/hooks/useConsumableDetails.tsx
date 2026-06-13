import { useQuery } from "@tanstack/react-query";
import { getConsumableByIdAction } from "../actions/get-consumable.action"; // Ajusta la ruta si es necesario

export const useConsumableDetails = (id: string) => {
  return useQuery({
    queryKey: ["consumable", id],
    queryFn: () => getConsumableByIdAction(id),
    enabled: !!id, // Evita disparar la petición si el ID no está listo
    staleTime: 1000 * 60 * 5, // 5 minutos de caché antes de considerarse obsoleto
  });
};
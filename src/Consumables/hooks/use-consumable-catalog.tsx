import { useState, useEffect } from "react";
import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";

interface CatalogItem {
  id: string | number;
  name: string;
}

interface UseCatalogResult {
  data: CatalogItem[];
  isLoading: boolean;
  onCreate: (payload: { name: string }) => Promise<CatalogItem>;
}
const createCatalogHook = (endpoint: string) => {
  return (): UseCatalogResult => {
    const [data, setData] = useState<CatalogItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Se recomienda envolver con useCallback o meter la declaración dentro del efecto
    useEffect(() => {
      const fetchData = async () => {
        try {
          setIsLoading(true);
          const response = await soporteTecnicoApi.get(endpoint);
          setData(response.data || []);
        } catch (error) {
          void error;
        } finally {
          setIsLoading(false);
        }
      };

      fetchData();
    }, [endpoint]); 

    const handleCreate = async (payload: { name: string }): Promise<CatalogItem> => {
      const response = await soporteTecnicoApi.post(endpoint, payload);
      const newItem = response.data;
      setData((prev) => [...prev, newItem]);
      return newItem;
    };

    return { data, isLoading, onCreate: handleCreate };
  };
};

export const useTypesConsumable = createCatalogHook("/types-consumable");
export const useBrandsConsumable = createCatalogHook("/brands-consumable");
export const useUnitsMeasurement = createCatalogHook("/units-measurement");
export const useUbicationsConsumable = createCatalogHook("/ubications-consumable");
export const useMovementTypesConsumable = createCatalogHook("/movement-types");
export const useMovementAplicationsConsumable = createCatalogHook("/movement-applications");


// 2. ¡REESCRITURA CON FACTORY! Para Tickets y Departamentos que usan paginación avanzada
import { getTicketsAction, getTicketsByIdAction } from "../actions/get-ticket.actions"; // Ajusta la ruta de tu action de tickets
import { useCatalogFactory } from "./use-catalog-factory";

export const useTicketsConsumables = () => { // Cambiado a plural para hacer match con tu Formulario
    return useCatalogFactory({
        queryKey: "tickets-catalog",
        dataKey: "data", // <-- Crucial: Tu backend responde con la llave "data"
        fetchFn: (args) => getTicketsAction({ limit: args.limit, query: args.query }),
        getByIdFn: (id) => getTicketsByIdAction(id),
    });
};

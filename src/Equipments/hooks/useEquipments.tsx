import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router";
import { getEquipmentsAction } from "../actions/get-equipments.action";

export const useEquipments = () => {
  const [searchParams] = useSearchParams();

  // Lee los filtros de la URL
  const category = searchParams.get("category") || "all";
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "all";
  
  // Lee paginación desde URL y calcula el offset para mandarlo al backend
  const page = Math.max(1, Number(searchParams.get("page") || "1"));
  const limit = Number(searchParams.get("limit") || "10");
  const offset = (page - 1) * limit;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["equipments", { category, search, status, limit, offset }],
    queryFn: () => getEquipmentsAction({ category, search, status, limit, offset }),
  });

  return {
    // Retornamos directamente .data mapeándolo a equipments para no romper tu EquipmentPage
    equipments: data?.data || [], 
    meta: data?.meta || { total: 0, page: 1, lastPage: 1 },
    isLoading,
    isError,
  };
};

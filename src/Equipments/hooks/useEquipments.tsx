import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router";
import { getEquipmentsAction } from "../actions/get-equipments.action";

export const useEquipments = () => {
  const [searchParams] = useSearchParams();

  // 1. Leemos el filtro de departamento desde los Query Params de la URL
  const category = searchParams.get("category") || "all";
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "all";
  const id_departament = searchParams.get("id_departament") || "";
  
  // Lee paginación desde URL y calcula el offset para mandarlo al backend
  const page = Math.max(1, Number(searchParams.get("page") || "1"));
  const limit = Number(searchParams.get("limit") || "10");
  const offset = (page - 1) * limit;

  const { data, isLoading, isError } = useQuery({
    // 2. Agregamos id_departament al queryKey para que React Query invalide y recargue la caché al cambiar de departamento
    queryKey: ["equipments", { category, search, status, id_departament, limit, offset }],
    queryFn: () => getEquipmentsAction({ category, search, status, id_departament, limit, offset }),
  });

  return {
    // Retornamos directamente .data mapeándolo a equipments para no romper tu EquipmentPage
    equipments: data?.data || [], 
    meta: data?.meta || { total: 0, page: 1, lastPage: 1 },
    isLoading,
    isError,
  };
};
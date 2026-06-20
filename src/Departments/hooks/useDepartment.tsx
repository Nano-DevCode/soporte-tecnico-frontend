import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { getDepartmentByIdAction } from "../actions/get-department.actions";

export const useDepartment = () => {
  const { id } = useParams();
  const { 
    data: department, 
    isLoading, 
    isFetching, 
    error 
  } = useQuery({
    queryKey: ['department', id],
    queryFn: () => getDepartmentByIdAction(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  return {
    department,
    isLoading,
    isFetching,
    error,
  };
};
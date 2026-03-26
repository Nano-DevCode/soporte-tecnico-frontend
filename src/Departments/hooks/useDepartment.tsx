import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { getDepartmentByIdAction } from "../actions/get-department.actions";

export const useDepartment = () => {
  const { id } = useParams();

  const departmentQuery = useQuery({
    queryKey: ['department', id],
    queryFn: () => getDepartmentByIdAction(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  return {
    department: departmentQuery.data,
    isLoading: departmentQuery.isLoading,
    isFetching: departmentQuery.isFetching,
    error: departmentQuery.error,
  };
};
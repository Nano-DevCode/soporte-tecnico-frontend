import { useQuery } from "@tanstack/react-query";
import { getUserAction } from "../actions/get-user.action";
import { useParams } from "react-router";

export const useUser = () => {
  const { id } = useParams();
  const query = useQuery({
    queryKey: ['user', id],
    queryFn: () => getUserAction(id!),
    enabled: !!id,
  });

  return {
    user: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
  };
};
import { useQuery } from "@tanstack/react-query"
import { getUsersActions } from "../actions/get-users.action"
import { useSearchParams } from "react-router"

export const useUsers = () => {

  const [searchParams] = useSearchParams();

  const limit = searchParams.get('limit') || 10;
  const page = searchParams.get('page') || 1;
  const offset = (Number(page) - 1) * Number(limit);
  const departmentId = searchParams.get('dept') || undefined;
  const status = searchParams.get('status') || undefined; 
  const query = searchParams.get("search")?.trim() || undefined; 

  return useQuery({
    queryKey: ['users',{limit, offset, departmentId, status, query }],
    queryFn: async() => getUsersActions({
      limit,
      offset,
      departmentId,
      status,
      query,
    }),
    staleTime: 1000 * 60 * 5,
  })
}

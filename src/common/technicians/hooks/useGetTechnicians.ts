import { useQuery } from "@tanstack/react-query"
import { techniciansQueryKeys } from "../keys/technicians-query.keys";
import { getTechniciansAction } from "../actions/get-tehchnicians.action";
export const useGetTechnicians = () => {

    return useQuery({
        queryKey: techniciansQueryKeys.lists(),
        queryFn: async () => getTechniciansAction(),
    })
}

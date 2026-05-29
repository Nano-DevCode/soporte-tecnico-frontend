import { useQuery } from "@tanstack/react-query"
import { useSearchParams } from "react-router"
import { STALE_TIME_5_MIN } from "@/config/query-constants";
import { getAllTechnicalReports } from "../actions/get-all-technical-reports.action";
import { technicalReportsQueryKeys } from "../keys/technical-reports-query.keys";
export const useGetAllTechnicalReports = () => {

    const [searchParams] = useSearchParams();

    const limit = Number(searchParams.get('limit')) || 10;
    const page = Number(searchParams.get('page')) || 1;
    const query = searchParams.get("search")?.trim() || undefined;

    return useQuery({
        queryKey: technicalReportsQueryKeys.list({
            limit, page, query
        }),
        queryFn: async () => getAllTechnicalReports({
            limit,
            page,
            query,
        }),
        staleTime: STALE_TIME_5_MIN,
    })
}

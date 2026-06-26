import { useMutation, useQueryClient } from "@tanstack/react-query";
import { technicalReportsQueryKeys } from "../../technical-reports/keys/technical-reports-query.keys";
import { updateTechnicalReportAction } from "../actions/update-technical-report.action";
import type { UpdateTechnicalReportResponse } from "../interfaces/update-technical-report";

export const useUpdateTechnicalReport = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateTechnicalReportAction,
        onSuccess: (technicalReport: UpdateTechnicalReportResponse) => {
            queryClient.invalidateQueries({
                queryKey: technicalReportsQueryKeys.lists()
            });
            queryClient.invalidateQueries({
                queryKey: technicalReportsQueryKeys.detail(technicalReport.id)
            });
        },
    });
};
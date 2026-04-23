import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUpdateSchoolPeriodAction } from "../actions/create-update-school-period.action";
import { schoolPeriodQueryKeys } from "../keys/school-period-query.keys";
import type { SchoolPeriod } from "../interfaces/school-period.interface";

export const useMutateSchoolPeriod = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createUpdateSchoolPeriodAction,
        onSuccess: (schoolPeriod: SchoolPeriod) => {
            queryClient.invalidateQueries({ queryKey: schoolPeriodQueryKeys.lists() });
            queryClient.setQueryData(
                schoolPeriodQueryKeys.detail(schoolPeriod.id),
                schoolPeriod
            );
        },
    });
};
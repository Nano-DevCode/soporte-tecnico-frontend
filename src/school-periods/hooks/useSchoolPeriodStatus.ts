import { useMutation, useQueryClient } from "@tanstack/react-query";
import { activateSchoolPeriodAction, deactivateSchoolPeriodAction } from "../actions/toggle-school-period-status.action";
import { schoolPeriodQueryKeys } from "../keys/school-period-query.keys";
import type { SchoolPeriod } from "../interfaces/school-period.interface";

export const useSchoolPeriodStatus = () => {
    const queryClient = useQueryClient();

    const activateMutation = useMutation({
        mutationFn: activateSchoolPeriodAction,
        onSuccess: (updatedSchoolPeriod: SchoolPeriod) => {
            queryClient.invalidateQueries({ queryKey: schoolPeriodQueryKeys.lists() });
            queryClient.setQueryData(
                schoolPeriodQueryKeys.detail(updatedSchoolPeriod.id),
                updatedSchoolPeriod
            );
        }
    });

    const deactivateMutation = useMutation({
        mutationFn: deactivateSchoolPeriodAction,
        onSuccess: (updatedSchoolPeriod: SchoolPeriod) => {
            queryClient.invalidateQueries({ queryKey: schoolPeriodQueryKeys.lists() });
            queryClient.setQueryData(
                schoolPeriodQueryKeys.detail(updatedSchoolPeriod.id),
                updatedSchoolPeriod
            );
        }
    });

    return {
        activateMutation,
        deactivateMutation
    };
};
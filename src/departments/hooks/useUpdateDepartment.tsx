import { useMutation, useQueryClient } from "@tanstack/react-query";
import { departamentUpdateAction, type UpdateDepartmentDTO } from "../actions/update-department.action";

export const useUpdateDepartment = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDepartmentDTO }) => 
      departamentUpdateAction(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      queryClient.invalidateQueries({ queryKey: ['department', variables.id] });
    },
  });

  return {
    updateDepartment: mutation.mutateAsync,
    isUpdating: mutation.isPending,
  };
};
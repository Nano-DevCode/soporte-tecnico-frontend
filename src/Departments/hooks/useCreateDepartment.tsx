import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createDepartmentAction, type CreateDepartmentDTO } from "../actions/post-departament.action";

export const useCreateDepartment = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newDepartment: CreateDepartmentDTO) => createDepartmentAction(newDepartment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
    },
  });

  return {
    createDepartment: mutation.mutateAsync,
    isCreating: mutation.isPending,
    error: mutation.error,
  };
};
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserAction, type UpdateUserDTO } from "../actions/update-user.action";

export const useUserUpdate = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserDTO }) => 
      updateUserAction(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', variables.id] });
    },
  });

  return {
    updateUser: mutation.mutateAsync,
    isUpdating: mutation.isPending,
  };
};
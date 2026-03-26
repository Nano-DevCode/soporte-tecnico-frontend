import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUserAction, type CreateUserDTO } from "../actions/create-user.action";

export const useUserCreate = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newUser: CreateUserDTO) => createUserAction(newUser),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  return {
    createUser: mutation.mutateAsync,
    isCreating: mutation.isPending,
  };
};
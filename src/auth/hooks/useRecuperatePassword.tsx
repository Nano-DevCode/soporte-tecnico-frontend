import { useMutation, useQueryClient } from "@tanstack/react-query";
import { recuperatePasswordAction } from "../actions/recuperate-password.action";

export const useRecuperatePassword = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: recuperatePasswordAction,
    retry: false,
    onSuccess: () => {
      queryClient.invalidateQueries(); 
    }
  });
};
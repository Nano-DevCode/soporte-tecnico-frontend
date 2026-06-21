import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchPasswordChangeAction } from "../actions/patch-password-changed.action";

export const useChangedPassword = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: patchPasswordChangeAction,
    retry: false,
    onSuccess: () => {
      queryClient.invalidateQueries(); 
    }
  });
};
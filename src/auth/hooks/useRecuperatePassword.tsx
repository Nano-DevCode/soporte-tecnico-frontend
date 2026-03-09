import { useMutation } from "@tanstack/react-query"
import { recuperatePasswordAction } from "../actions/recuperate-password.action"

export const useRecuperatePassword = () => {
  return useMutation({
    mutationFn: recuperatePasswordAction,
    retry: false,
  })
}
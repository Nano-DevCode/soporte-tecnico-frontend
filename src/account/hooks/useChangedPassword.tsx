import { useMutation } from "@tanstack/react-query"
import { patchPasswordChangeAction } from "../actions/patch-password-changed.action"

export const useChangedPassword = () => {
  return useMutation({
    mutationFn: patchPasswordChangeAction,
    retry: false,
  })
}

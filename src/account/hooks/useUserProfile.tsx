import { useQuery } from "@tanstack/react-query";
import { getProfileActions } from "../actions/get-profile.actiont";
import { useAuthStore } from "@/auth/store/auth.store";

export const useProfile = () => {
  const { user } = useAuthStore();
  const id = user?.id || '';
  return useQuery({
    queryKey: ['profile', id], 
    queryFn: async () => await getProfileActions(), 
    staleTime: 1000 * 60 * 15,
    enabled: !!id, 
  });
}
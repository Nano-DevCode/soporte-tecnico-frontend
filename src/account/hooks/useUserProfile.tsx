import { useQuery } from "@tanstack/react-query";
import { getUserActions } from "../../users/actions/getuser.actiont";
import { useAuthStore } from "@/auth/store/auth.store";

export const useUserProfile = () => {
  const { user } = useAuthStore();
  const id = user?.id || '';
  return useQuery({
    queryKey: ['profile', id], 
    queryFn: async () => await getUserActions(id), 
    staleTime: 1000 * 60 * 15,
    enabled: !!id, 
  });
}
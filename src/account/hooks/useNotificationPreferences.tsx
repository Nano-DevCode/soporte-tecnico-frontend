import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getNotificationPreferences, updateNotificationPreferences } from "../actions/preferences.action";
import { useAuthStore } from "@/auth/store/auth.store";
import { toast } from "sonner";

export const useNotificationPreferences = () => {
  const { user } = useAuthStore();
  const id = user?.id || '';
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['notification-preferences', id],
    queryFn: async () => await getNotificationPreferences(),
    staleTime: 1000 * 60 * 15,
    enabled: !!id,
  });

  const mutation = useMutation({
    mutationFn: updateNotificationPreferences,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notification-preferences', id] });
      toast.success('Preferencias actualizadas', {
        description: 'Tus preferencias de notificaciones han sido guardadas exitosamente.'
      });
    },
    onError: (error: Error) => {
      toast.error('Error al actualizar', {
        description: error.message || 'No se pudieron guardar las preferencias.'
      });
    }
  });

  return {
    ...query,
    updatePreferences: mutation.mutate,
    isUpdating: mutation.isPending
  };
};

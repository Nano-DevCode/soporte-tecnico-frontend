import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getFeatureFlags, toggleFeatureFlag, executeSeed } from '../api/feature-flags.api';
import { toast } from 'sonner';

export const useFeatureFlags = () => {
  return useQuery({
    queryKey: ['feature-flags'],
    queryFn: getFeatureFlags,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
};

export const useFeatureFlag = (id: string) => {
  const { data: flags = [] } = useFeatureFlags();
  const flag = flags.find((f) => f.id === id);
  return flag ? flag.enabled : false;
};

export const useToggleFeatureFlag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, enabled }: { id: string; enabled: boolean }) => toggleFeatureFlag(id, enabled),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['feature-flags'] });
      toast.success(data.enabled ? 'Función activada' : 'Función desactivada', { 
        description: data.title 
      });
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error('Error al actualizar', {
        description: err?.response?.data?.message || 'No se pudo cambiar el estado de la función',
      });
    }
  });
};

export const useSeedFeatureFlags = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: executeSeed,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feature-flags'] });
      toast.success('Seed ejecutado correctamente');
    },
    onError: () => {
      toast.error('Error al ejecutar el seed');
    }
  });
};

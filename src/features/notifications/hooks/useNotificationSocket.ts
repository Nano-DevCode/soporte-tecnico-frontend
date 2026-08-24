import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { socket } from '@/tickets/websockets/socket';
import { useNavigate } from 'react-router';
import type { Notification } from '../api/notifications.api';

export const playNotificationSound = () => {
  try {
    const audio = new Audio('/notification.mp3');
    audio.play().catch(e => console.error("Error al reproducir el sonido de notificación", e));
  } catch (e) {
    console.error("No se pudo crear el objeto Audio", e);
  }
};

export const useNotificationSocket = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    const handleNotification = (payload: Notification) => {
      // Reproducir sonido
      playNotificationSound();

      // Mostrar toast con botón de acción si tiene entityId
      toast.info(payload.title, {
        description: payload.message,
        action: payload.entityId ? {
          label: 'Ver ticket',
          onClick: () => navigate(`/tickets/${payload.entityId}`),
        } : undefined,
      });

      // Invalidar las queries para refrescar la lista y contador
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    };

    socket.on('new_notification', handleNotification);

    return () => {
      socket.off('new_notification', handleNotification);
    };
  }, [queryClient, navigate]);
};

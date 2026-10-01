import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { socket } from '@/tickets/websockets/socket';
import { useNavigate } from 'react-router';
import type { Notification } from '../api/notifications.api';

const notificationAudio = new Audio('/notification.mp3');

export const playNotificationSound = () => {
  try {
    notificationAudio.currentTime = 0; 
    notificationAudio.play().catch(e => {
      console.warn("El navegador bloqueó el sonido por falta de interacción.", e);
    });
  } catch (e) {
    console.error("No se pudo reproducir el audio", e);
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
      playNotificationSound();
      toast.info(payload.title, {
        description: payload.message,
        action: payload.entityId ? {
          label: 'Ver ticket',
          onClick: () => navigate(`/tickets/${payload.entityId}`),
        } : undefined,
      });

      if ('Notification' in window && Notification.permission === 'granted') {
        const browserNotification = new window.Notification(payload.title, {
          body: payload.message,
          icon: '/logo.png', 
          silent: true,
        });

        browserNotification.onclick = () => {
          window.focus(); // Trae la pestaña al frente
          if (payload.entityId) {
            navigate(`/tickets/${payload.entityId}`);
          }
          browserNotification.close();
        };
      }
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    };

    const handleSlaAlert = (payload: Notification) => {
      playNotificationSound();
      const isBreach = payload.title?.toLowerCase().includes('vencid') || payload.title?.toLowerCase().includes('breach') || payload.title?.toLowerCase().includes('crítica');

      const toastFn = isBreach ? toast.error : toast.warning;
      toastFn(payload.title, {
        description: payload.message,
        action: payload.entityId ? {
          label: 'Ver ticket',
          onClick: () => navigate(`/tickets/${payload.entityId}`),
        } : undefined,
      });

      if ('Notification' in window && Notification.permission === 'granted') {
        const browserNotification = new window.Notification(payload.title, {
          body: payload.message,
          icon: '/logo.png',
          silent: true,
        });

        browserNotification.onclick = () => {
          window.focus();
          if (payload.entityId) {
            navigate(`/tickets/${payload.entityId}`);
          }
          browserNotification.close();
        };
      }

      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['sla'] });
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    };

    socket.on('new_notification', handleNotification);
    socket.on('sla_alert', handleSlaAlert);

    return () => {
      socket.off('new_notification', handleNotification);
      socket.off('sla_alert', handleSlaAlert);
    };
  }, [queryClient, navigate]);
};
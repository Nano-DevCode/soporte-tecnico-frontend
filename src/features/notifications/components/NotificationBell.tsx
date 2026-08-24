import { useState } from 'react';
import { Bell, Check } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getUnreadCount, getNotifications, markAsRead, markAllAsRead, type Notification } from '../api/notifications.api';
import { useNotificationSocket } from '../hooks/useNotificationSocket';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { useNavigate } from 'react-router';

export function NotificationBell() {
  useNotificationSocket();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const { data: unreadCount = 0 } = useQuery({
    queryKey: ['notifications', 'unread'],
    queryFn: getUnreadCount,
    refetchInterval: 60000,
  });

  const { data: notificationsData } = useQuery({
    queryKey: ['notifications', 'list'],
    queryFn: () => getNotifications(1, 20),
    enabled: isOpen,
  });

  const markReadMutation = useMutation({
    mutationFn: markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const markAllMutation = useMutation({
    mutationFn: markAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const notifications = notificationsData?.data || [];

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5 text-muted-foreground" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <span className="font-semibold text-sm">Notificaciones</span>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto px-2 py-1 text-xs text-blue-600 hover:text-blue-700"
              onClick={() => markAllMutation.mutate()}
              disabled={markAllMutation.isPending}
            >
              Marcar todo como leído
            </Button>
          )}
        </div>
        <ScrollArea className="h-80">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center text-sm text-muted-foreground">
              <Bell className="mb-2 h-8 w-8 opacity-20" />
              <p>No tienes notificaciones</p>
            </div>
          ) : (
            <div className="flex flex-col">
              {notifications.map((notif: Notification) => (
                <div
                  key={notif.id}
                  className={`flex items-start gap-3 border-b p-4 transition-colors hover:bg-muted/50 ${!notif.isRead ? 'bg-primary/5' : ''
                    }`}
                >
                  <div className="flex-1 space-y-1">
                    <p className={`text-sm ${!notif.isRead ? 'font-medium' : ''}`}>
                      {notif.title}
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {notif.message}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-1 block">
                      {formatDistanceToNow(new Date(notif.createdAt), {
                        addSuffix: true,
                        locale: es,
                      })}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 items-end shrink-0 justify-center">
                    {!notif.isRead && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 rounded-full"
                        onClick={() => markReadMutation.mutate(notif.id)}
                        title="Marcar como leída"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                    {notif.entityId && (
                      <Button
                        variant="secondary"
                        size="sm"
                        className="h-6 text-[10px] px-2"
                        onClick={() => {
                          setIsOpen(false);
                          navigate(`/tickets/${notif.entityId}`);
                        }}
                      >
                        Ver
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}

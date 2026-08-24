import { soporteTecnicoApi } from '@/api/soporteTecnicoApi';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  entityId?: string;
  createdAt: string;
}

export const getNotifications = async (page = 1, limit = 10) => {
  const { data } = await soporteTecnicoApi.get(`/notifications?page=${page}&limit=${limit}`);
  return data;
};

export const getUnreadCount = async () => {
  const { data } = await soporteTecnicoApi.get<{count: number}>('/notifications/unread/count');
  return data.count;
};

export const markAsRead = async (id: string) => {
  const { data } = await soporteTecnicoApi.patch(`/notifications/${id}/read`);
  return data;
};

export const markAllAsRead = async () => {
  const { data } = await soporteTecnicoApi.patch('/notifications/read-all');
  return data;
};

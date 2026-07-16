import { io } from 'socket.io-client';
import { API_BASE_URL } from '@/api/soporteTecnicoApi';

const SOCKET_URL = API_BASE_URL.replace('/api', '/realtime');

export const socket = io(SOCKET_URL, {
  withCredentials: true,
  transports: ['polling', 'websocket'],
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  randomizationFactor: 0.5,
});
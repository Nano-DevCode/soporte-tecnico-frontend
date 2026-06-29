import { io } from 'socket.io-client';

export const socket = io('http://localhost:3000/realtime', {
  withCredentials: true,
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  randomizationFactor: 0.5,
});
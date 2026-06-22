export const logError = (error: unknown, context: string, extraMessage?: string): void => {
  // 1. Vite pone esto en 'true' automáticamente cuando programas localmente
  const isDev = import.meta.env.DEV; 

  // 2. Leemos tu variable del .env (siempre vendrá como string, por eso comparamos con 'true')
  const forceLogs = import.meta.env.VITE_ENABLE_LOGS === 'true';

  // Solo mostramos logs si es desarrollo O si lo pedimos explícitamente en el .env
  if (isDev || forceLogs) {
    console.group(`Error en: ${context}`);
    
    // Si mandaste un mensaje extra, lo mostramos aquí
    if (extraMessage) {
      console.info(`Detalle: ${extraMessage}`);
    }
    
    console.error(error);
    console.groupEnd();
  }
};
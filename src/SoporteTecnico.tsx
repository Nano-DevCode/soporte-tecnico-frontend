import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from "sileo";
import type { PropsWithChildren } from 'react';
import { CustomFullScreenLoading } from './components/custom/CustomFullScreenLoading';
import { useAuthStore } from './auth/store/auth.store';

import { ThemeProvider } from './components/theme-provider';
import { TooltipProvider } from './components/ui/tooltip';
import { SessionTimer } from './auth/components/SessionTimer';

import { AppRouter } from './app.router' 

const queryClient = new QueryClient();

const CheckAuthProvider = ({ children }: PropsWithChildren) => {

  const { checkAuthStatus } = useAuthStore();

  const { isLoading } = useQuery({
    queryKey: ['auth'],
    queryFn: checkAuthStatus,
    retry: false,
    refetchInterval: 1000 * 60 * 1.5,
    refetchOnWindowFocus: false,
  });

  if (isLoading) return <CustomFullScreenLoading />;

  return (
    <>
      <SessionTimer />
      {children}
    </>
  );
}

export const SoporteTecnico = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="soporte-tecnico-theme">
        <TooltipProvider>
          <CheckAuthProvider>
            <AppRouter />
          </CheckAuthProvider>
        </TooltipProvider>

        <Toaster position='top-center' theme='system' />
        <ReactQueryDevtools initialIsOpen={false} />

      </ThemeProvider>

    </QueryClientProvider>
  )
}
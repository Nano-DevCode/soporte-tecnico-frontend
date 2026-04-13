import { Suspense } from 'react';
import type { PropsWithChildren } from 'react';
import { CustomFullScreenLoading } from './CustomFullScreenLoading';

export const SuspenseWrapper = ({ children }: PropsWithChildren) => {
  return (
    <Suspense fallback={<CustomFullScreenLoading />}>
      {children}
    </Suspense>
  );
};
import { RedirectPerRole } from '@/auth/routes/ProtectedRoutes';
import type { ConsumablesPermissionsTypes } from './permisos';
import { useCan } from './useCan';

interface CanRouteProps {
    permission: ConsumablesPermissionsTypes;
    children: React.ReactNode;
}

export const CanRoutePage = ({ permission, children }: CanRouteProps) => {
    const { can } = useCan();

    if (!can(permission)) return <RedirectPerRole />

    return <>{children}</>;
};
import { RedirectPerRole } from '@/auth/routes/ProtectedRoutes';
import type { PermissionsTypes } from './permissions';
import { useCan } from './useCan';

interface CanRouteProps {
    permission: PermissionsTypes;
    children: React.ReactNode;
}

export const CanRoute = ({ permission, children }: CanRouteProps) => {
    const { can } = useCan();

    if (!can(permission)) return <RedirectPerRole />

    return <>{children}</>;
};
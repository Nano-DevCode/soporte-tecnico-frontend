import type{ ConsumablesPermissionsTypes } from './permisos';
import { useCan } from './useCan';

interface CanProps {
    permission: ConsumablesPermissionsTypes;
    children: React.ReactNode;
}

export const CanAction = ({ permission, children }: CanProps) => {
    const { can } = useCan();

    if (!can(permission)) {
        return null;
    }

    return <>{children}</>;
};
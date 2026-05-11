import type { PermissionsTypes } from './permissions';
import { useCan } from './useCan';

interface CanProps {
    permission: PermissionsTypes;
    children: React.ReactNode;
}

export const Can = ({ permission, children }: CanProps) => {
    const { can } = useCan();

    if (!can(permission)) {
        return null;
    }

    return <>{children}</>;
};
import { useAuthStore } from "@/auth/store/auth.store";
import { ROLE_PERMISSIONS, type PermissionsTypes } from "./permissions";

export const useCan = () => {
    const roleName = useAuthStore(state => state.user?.role.name);

    const can = (permission: PermissionsTypes): boolean => {
        if (!roleName) return false;
        const rolePermissions = ROLE_PERMISSIONS[roleName] || [];
        return rolePermissions.includes(permission);
    };

    return { can };
};
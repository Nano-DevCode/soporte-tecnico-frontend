import { useAuthStore } from "@/auth/store/auth.store";
import { CONSUMABLES_ROLE_PERMISSIONS, type ConsumablesPermissionsTypes } from "./permisos";

export const useCan = () => {
    const roleName = useAuthStore(state => state.user?.role.name);

    const can = (permission: ConsumablesPermissionsTypes): boolean => {
        if (!roleName) return false;
        const rolePermissions = CONSUMABLES_ROLE_PERMISSIONS[roleName] || [];
        return rolePermissions.includes(permission);
    };

    return { can };
};
import { AppRoles } from "../interfaces/authResponse.interface";
import { useAuthStore } from "../store/auth.store";

export const useUserRoles = () => {
  const roleName = useAuthStore(state => state.user?.role?.name);

  return {
    isSuperAdmin:  roleName === AppRoles.SuperAdmin,
    isBossCC:      roleName === AppRoles.JefeCC,
    isCoordinator: roleName === AppRoles.Coordinador,
    isBoss:        roleName === AppRoles.JefeDepartamento,
    isTechnician:  roleName === AppRoles.Tecnico,
    isPlaning:     roleName === AppRoles.Planeacion,
    isSecretaryCC: roleName === AppRoles.SecretariaCC,
    isVisitor:     roleName === AppRoles.Visitante,
    isInventory:   roleName === AppRoles.Inventario,
  };
};
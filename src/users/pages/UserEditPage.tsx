import { useNavigate, useParams } from "react-router";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useDepartments } from "../hooks/useDepartment";
import { useRoles } from "../hooks/userRoles";
import { useUser } from "../hooks/useUser"; 
import { useCoordinations } from "../hooks/useCoordinations";
import { useUserUpdate } from "../hooks/useUserUpdate";
import { CustomUserForm } from "../components/CustomUserForm";
import { sileo } from "sileo";
import type { UserFormData } from "../schema/user-form.schema";
import type { AxiosError } from "axios";
import type { BackendError } from "@/interfaces/backendError.interfaces";
import { CustomTitlePageWithBack } from "@/components/custom/CustomTitlePageWithBack";
import { logError } from "@/utils/logger";
import { useTranslation } from "react-i18next";

const UserEditPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  
  const { user, isLoading: isLoadingUser, isError: isErrorUser} = useUser();
  const { data: departments, isLoading: isLoadingDepartments } = useDepartments();
  const { data: roles, isLoading: isLoadingRoles } = useRoles();
  const { data: coordinations, isLoading: isLoadingCoordinations } = useCoordinations();
  
  const { updateUser, isUpdating } = useUserUpdate();

  const isLoading = isLoadingUser || isLoadingDepartments || isLoadingRoles || isLoadingCoordinations || !user || !roles || !departments || !coordinations;

  // Manejamos la redirección de error dentro de un useEffect para evitar problemas de renderizado en React
  useEffect(() => {
    if (isErrorUser) {
      sileo.error({ 
        title: t("users.pages.userEditPage.sileo.notFoundTitle"), 
        description: t("users.pages.userEditPage.sileo.notFoundDescription") 
      });
      navigate('/users', { replace: true });
    }
  }, [isErrorUser, navigate, t]);

  const handleUpdate = async (data: UserFormData) => {
    const payload: Partial<UserFormData> = {
      email: data.email.trim(),
      name: data.name.trim(),
      paternalSurname: data.paternalSurname.trim(),
      maternalSurname: data.maternalSurname.trim(),
      num_control: data.num_control.trim(),
      roleId: data.roleId,
      departmentId: data.departmentId,
      rfc: data.rfc.trim(),
      idTelegram: data.idTelegram ? data.idTelegram.trim() : undefined,
      coordinationId: data.coordinationId,
    };

    if (data.password && data.password.trim() !== "") {
      payload.password = data.password;
    }

    try {
      await sileo.promise(updateUser({ id: id!, data: payload }), {
        loading: { title: t("users.pages.userEditPage.sileo.loading") },
        success: { 
          title: t("users.pages.userEditPage.sileo.successTitle"), 
          description: t("users.pages.userEditPage.sileo.successDescription"), 
          duration: 4000 
        },
        error: (err: unknown) => { 
          const axiosErr = err as AxiosError<BackendError>;
          let backendMessage = t("users.pages.userEditPage.sileo.errorDefault");
          
          if (axiosErr.response?.data?.message) {
            backendMessage = Array.isArray(axiosErr.response.data.message) 
              ? axiosErr.response.data.message[0] 
              : axiosErr.response.data.message;
          }
          return { 
            title: t("users.pages.userEditPage.sileo.errorTitle"), 
            description: backendMessage 
          };
        }
      });
      navigate("/users");
    } catch (error) {
      logError(error, "UserEditPage");
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl space-y-4">
      <CustomTitlePageWithBack
        backLink="/users"
        title={t("users.pages.userEditPage.title")}
        description={t("users.pages.userEditPage.description")}
      />

      {isLoading ? (
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-8">
           <Skeleton className="h-12 w-full" />
           <Skeleton className="h-64 w-full" />
        </div>
      ) : (
        <CustomUserForm
          mode="edit"
          user={user} 
          roles={roles} 
          departments={departments} 
          coordinations={coordinations} 
          onSubmitCallback={handleUpdate}
          isMutating={isUpdating}
        />
      )}
    </div>
  );
};

export default UserEditPage;
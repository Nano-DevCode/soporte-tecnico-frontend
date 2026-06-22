import { useNavigate } from "react-router";
import { Skeleton } from "@/components/ui/skeleton";
import { useDepartments } from "../hooks/useDepartment";
import { useRoles } from "../hooks/userRoles";
import { useCoordinations } from "../hooks/useCoordinations";
import { useUserCreate } from "../hooks/useUserCreate";
import { CustomUserForm } from "../components/CustomUserForm";
import { sileo } from "sileo";
import type { UserFormData } from "../schema/user-form.schema";
import type { AxiosError } from "axios";
import type { BackendError } from "@/interfaces/backendError.interfaces";
import { CustomTitlePageWithBack } from "@/components/custom/CustomTitlePageWithBack";
import { logError } from "@/utils/logger";

const UserCreatePage = () => {
  const navigate = useNavigate();
  
  const { data: departments, isLoading: isLoadingDepartments } = useDepartments();
  const { data: roles, isLoading: isLoadingRoles } = useRoles();
  const { data: coordinations, isLoading: isLoadingCoordinations } = useCoordinations();
  
  const { createUser, isCreating } = useUserCreate();

  const isLoading = isLoadingDepartments || isLoadingRoles || isLoadingCoordinations || !roles || !departments || !coordinations;

  const handleCreate = async (data: UserFormData) => {
    const payload = {
      email: data.email.trim(),
      password: data.password!, 
      name: data.name.trim(),
      paternalSurname: data.paternalSurname.trim(),
      maternalSurname: data.maternalSurname.trim(),
      num_control: data.num_control.trim(),
      roleId: data.roleId,
      departmentId: data.departmentId,
      rfc: data.rfc.trim(),
      idTelegram: data.idTelegram ? data.idTelegram.trim() : undefined,
      coordinationId: data.coordinationId ? data.coordinationId : undefined,
    };

    try {
      await sileo.promise(createUser(payload), {
        loading: { title: "Creando usuario..." },
        success: { title: "¡Usuario creado!", description: `${payload.name} se guardó correctamente.`, duration: 4000 },
        error: (err: unknown) => { 
          const axiosErr = err as AxiosError<BackendError>;
          let backendMessage = "Revisa los datos e intenta de nuevo.";
          if (axiosErr.response?.data?.message) {
            backendMessage = Array.isArray(axiosErr.response.data.message) ? axiosErr.response.data.message[0] : axiosErr.response.data.message;
          }
          return { title: "Error al crear", description: backendMessage };
        }
      });
      navigate("/users");
    } catch (error) {
      logError(error, "UserCreatePage");
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl space-y-4">
      <CustomTitlePageWithBack backLink="/users" title="Crear Usuario" description="Completa el formulario para crear un nuevo usuario." />

      {isLoading ? (
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-8">
           <Skeleton className="h-12 w-full" />
           <Skeleton className="h-64 w-full" />
        </div>
      ) : (
        <CustomUserForm
          mode="create"
          roles={roles} 
          departments={departments} 
          coordinations={coordinations} 
          onSubmitCallback={handleCreate}
          isMutating={isCreating}
        />
      )}
    </div>
  );
};

export default UserCreatePage;
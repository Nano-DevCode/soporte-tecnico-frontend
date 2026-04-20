import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { Skeleton } from "@/components/ui/skeleton";
import { useDepartments } from "../hooks/useDepartment";
import { useRoles } from "../hooks/userRoles";
import { useUser } from "../hooks/useUser"; 
import { useCoordinations } from "../hooks/useCoordinations";
import { useUserUpdate } from "../hooks/useUserUpdate";
import { CustomUserForm } from "../components/CustomUserForm"; // Asegura la ruta correcta
import { sileo } from "sileo";
import type { UserFormData } from "../schema/user-form.schema";
import type { AxiosError } from "axios";
import type { BackendError } from "@/interfaces/backendError.interfaces";

export const UserEditPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const { user, isLoading: isLoadingUser, isError: isErrorUser} = useUser();
  const { data: departments, isLoading: isLoadingDepartments } = useDepartments();
  const { data: roles, isLoading: isLoadingRoles } = useRoles();
  const { data: coordinations, isLoading: isLoadingCoordinations } = useCoordinations();
  
  const { updateUser, isUpdating } = useUserUpdate();

  const isLoading = isLoadingUser || isLoadingDepartments || isLoadingRoles || isLoadingCoordinations || !user || !roles || !departments || !coordinations;

  if (isErrorUser) {
    sileo.error({ title: "No se encontro ese usuario", description:"Verifique si los datos son correctos" });
    navigate('/users');
  }

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
        loading: { title: "Actualizando usuario..." },
        success: { title: "¡Actualizado!", description: "Los cambios se guardaron correctamente.", duration: 4000 },
        error: (err: unknown) => { 
          const axiosErr = err as AxiosError<BackendError>;
          let backendMessage = "Revisa los datos e intenta de nuevo.";
          if (axiosErr.response?.data?.message) {
            backendMessage = Array.isArray(axiosErr.response.data.message) ? axiosErr.response.data.message[0] : axiosErr.response.data.message;
          }
          return { title: "Error al actualizar", description: backendMessage, fill: "#18181b", styles: { title: "text-red-500! font-semibold!" } };
        }
      });
      navigate("/users");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl space-y-4">
      <button onClick={() => navigate('/users')} className="group flex w-fit items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" /> Regresar a Usuarios
      </button>

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
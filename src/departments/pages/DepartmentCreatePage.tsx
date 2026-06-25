import { useNavigate } from "react-router";
import { sileo } from "sileo";
import { isAxiosError } from "axios";
import { useCreateDepartment } from "../hooks/useCreateDepartment";
import { CustomDepartmentForm } from "../components/CustomDepartmentForm";
import type { Department } from "../interfaces/department.interface";
import type { BackendError } from "@/interfaces/backendError.interfaces";
import { CustomTitlePageWithBack } from "@/components/custom/CustomTitlePageWithBack";
import { logError } from "@/utils/logger";

export const DepartmentCreatePage = () => {
  const navigate = useNavigate();
  const { createDepartment, isCreating } = useCreateDepartment();

  const handleCreate = async (data: Department) => {
    const payload = {
      name: data.name.trim(),
      acronym: data.acronym.trim().toUpperCase(),
      priority: Number(data.priority),
    };

    try {
      await sileo.promise(createDepartment(payload), {
        loading: { title: "Creando departamento..." },
        success: { 
          title: "¡Departamento creado!", 
          description: `${payload.name} se guardó correctamente.`,
          duration: 4000 
        },
        error: (err) => { 
          let backendMessage = "Revisa los datos e intenta de nuevo.";
          if (isAxiosError<BackendError>(err) && err.response?.data?.message) {
            const rawMessage = err.response.data.message;
            backendMessage = Array.isArray(rawMessage) ? rawMessage[0] : rawMessage;
          }
          return {
            title: "Error al crear", 
            description: backendMessage,
            duration: 5000,
            fill: "#18181b",
            styles: {
              title: "text-red-500! font-semibold!",
              description: "text-zinc-400!",
            }
          };
        }
      });
      navigate("/departments");
    } catch (error) {
      logError(error, "DepartmentCreatePage");
    }
  };

  return (
    <div className="mx-auto w-full max-w-3xl space-y-4">
      <CustomTitlePageWithBack 
        backLink="/departments"
        title="Crear Departamento"
        description="Completa los datos del nuevo departamento"
      />

      <CustomDepartmentForm 
        mode="create" 
        onSubmitCallback={handleCreate} 
        isMutating={isCreating} 
      />
    </div>
  );
};
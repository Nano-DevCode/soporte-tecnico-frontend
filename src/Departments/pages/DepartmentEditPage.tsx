import { useNavigate, useParams } from "react-router";
import { sileo } from "sileo";
import { isAxiosError } from "axios";
import { useDepartment } from "../hooks/useDepartment";
import { useUpdateDepartment } from "../hooks/useUpdateDepartment";
import { CustomDepartmentForm } from "../components/CustomDepartmentForm";
import { CustomSkeletonInformation } from "@/components/custom/CustomSkeletonInformation";
import { CustomBackToList } from "@/components/custom/CustomBackToList";
import type { Department } from "../interfaces/department.interface";
import type { BackendError } from "@/interfaces/backendError.interfaces";

export const DepartmentEditPage = () => {
  const navigate = useNavigate();
  const { id } = useParams(); 
  
  const { department, isLoading: isLoadingData } = useDepartment();
  const { updateDepartment, isUpdating } = useUpdateDepartment();

  const handleUpdate = async (data: Department) => {
    if (!id) return;

    const payload = {
      name: data.name.trim(),
      acronym: data.acronym.trim().toUpperCase(),
      priority: Number(data.priority),
      folio: Number(data.folio),
    };

    try {
      await sileo.promise(updateDepartment({ id, data: payload }), {
        loading: { title: "Actualizando..." },
        success: { 
          title: "¡Actualizado!", 
          description: "Los cambios se guardaron correctamente.",
          duration: 4000 
        },
        error: (err) => { 
          let backendMessage = "Revisa los datos e intenta de nuevo.";
          if (isAxiosError<BackendError>(err) && err.response?.data?.message) {
            const rawMessage = err.response.data.message;
            backendMessage = Array.isArray(rawMessage) ? rawMessage[0] : rawMessage;
          }
          return {
            title: "Error al actualizar", 
            description: backendMessage,
            duration: 5000,
          };
        }
      });
      navigate("/department");
    } catch (error) {
      console.error("Error en la actualización:", error);
    }
  };

  if (isLoadingData) {
    return <CustomSkeletonInformation />;
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-4">
      <CustomBackToList 
        onBack={() => navigate('/department')} 
        backLabel="Lista de Departamentos"
      />

      <CustomDepartmentForm 
        mode="edit" 
        department={department} 
        onSubmitCallback={handleUpdate} 
        isMutating={isUpdating} 
      />
    </div>
  );
};
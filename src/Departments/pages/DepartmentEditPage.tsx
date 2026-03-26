import { 
  Building2,
  Save,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate, useParams } from "react-router";
import { sileo } from "sileo";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { isAxiosError } from "axios";

import { useDepartment } from "../hooks/useDepartment";
import { useUpdateDepartment } from "../hooks/useUpdateDepartment";
import type { Department } from "../interfaces/department.interface";
import { CustomSkeletonInformation } from "@/components/custom/CustomSkeletonInformation";
import { CustomBackToList } from "@/components/custom/CustomBackToList";

interface BackendError {
  message: string | string[];
  error: string;
  statusCode: number;
}

export const DepartmentEditPage = () => {
  const navigate = useNavigate();
  const { id } = useParams(); 
  
  const { department, isLoading: isLoadingData } = useDepartment();
  const { updateDepartment, isUpdating } = useUpdateDepartment();

  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<Department>({
    values: {
      name: department?.name || "",
      acronym: department?.acronym || "",
      priority: department?.priority || 1,
      folio: department?.folio?.toString() || "",
    }
  });

  const onSubmit = async (data: Department) => {
    if (!id) return;

    const payload = {
      name: data.name.trim(),
      acronym: data.acronym.trim().toUpperCase(),
      priority: Number(data.priority),
      folio: Number(data.folio),
    };

    try {
      await sileo.promise(updateDepartment({ id, data: payload }), {
        loading: { 
          title: "Actualizando...",
        },
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
    return (
      <CustomSkeletonInformation/>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-4">
      
      <CustomBackToList onBack={() => navigate('/department')} backLabel="Lista de Departamentos"/>

      <form onSubmit={handleSubmit(onSubmit)} className="rounded-xl border border-border bg-card p-6 shadow-sm">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Building2 className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-foreground leading-none">
                Editar Departamento
              </h3>
              <p className="text-sm font-medium text-muted-foreground">
                Modifica los datos del registro actual
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6">
          
          <div className="sm:col-span-2 space-y-2">
            <Label htmlFor="name" className={cn("text-xs font-bold uppercase tracking-wider text-muted-foreground", errors.name && "text-red-500")}>
              Nombre del Departamento <span className="text-red-500">*</span>
            </Label>
            <Input 
              id="name"
              className={cn("bg-muted/10", errors.name && "border-red-500 focus-visible:ring-red-500")}
              {...register("name", { 
                required: "El nombre es obligatorio",
                validate: (value) => value.trim().length >= 3 || "Debe tener al menos 3 caracteres" 
              })}
            />
            {errors.name && <p className="text-xs font-medium text-red-500">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="acronym" className={cn("text-xs font-bold uppercase tracking-wider text-muted-foreground", errors.acronym && "text-red-500")}>
              Acrónimo <span className="text-red-500">*</span>
            </Label>
            <Input 
              id="acronym"
              className={cn("bg-muted/10 uppercase", errors.acronym && "border-red-500 focus-visible:ring-red-500")}
              {...register("acronym", { 
                required: "El acrónimo es obligatorio",
                validate: (value) => value.trim().length > 0 || "No puede estar vacío"
              })}
            />
            {errors.acronym && <p className="text-xs font-medium text-red-500">{errors.acronym.message}</p>}
          </div>

          {/* Folio */}
          <div className="space-y-2">
            <Label htmlFor="folio" className={cn("text-xs font-bold uppercase tracking-wider text-muted-foreground", errors.folio && "text-red-500")}>
              Folio <span className="text-red-500">*</span>
            </Label>
            <Input 
              id="folio"
              type="number"
              className={cn("bg-muted/10", errors.folio && "border-red-500 focus-visible:ring-red-500")}
              {...register("folio", { 
                required: "El folio es requerido",
                min: { value: 1, message: "Debe ser mayor a 0" }
              })}
            />
            {errors.folio && <p className="text-xs font-medium text-red-500">{errors.folio.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority" className={cn("text-xs font-bold uppercase tracking-wider text-muted-foreground", errors.priority && "text-red-500")}>
              Nivel de Prioridad <span className="text-red-500">*</span>
            </Label>
            <Input 
              id="priority"
              type="number"
              className={cn("bg-muted/10", errors.priority && "border-red-500 focus-visible:ring-red-500")}
              {...register("priority", { 
                required: "La prioridad es requerida",
                min: { value: 1, message: "Debe ser mayor a 0" }
              })}
            />
            {errors.priority && <p className="text-xs font-medium text-red-500">{errors.priority.message}</p>}
          </div>

        </div>

        <div className="mt-8 flex flex-col sm:flex-row justify-end gap-3 border-t border-border pt-6">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate('/department')}
            className="w-full sm:w-auto"
            disabled={isUpdating}
          >
            <X className="mr-2 h-4 w-4" />
            Cancelar
          </Button>
          
          <Button 
            type="submit" 
            className="w-full sm:w-auto bg-blue-700 hover:bg-blue-800 text-white"
            disabled={isUpdating} 
          >
            <Save className="mr-2 h-4 w-4" />
            {isUpdating ? "Actualizando..." : "Guardar Cambios"}
          </Button>
        </div>

      </form>
    </div>
  );
};
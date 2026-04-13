import { 
  Building2, 
  ArrowLeft,
  Save,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router";
import { sileo } from "sileo";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateDepartment } from "../hooks/useCreateDepartment";
import { isAxiosError } from "axios";
import type { Department } from "../interfaces/department.interface";
import type { BackendError } from "@/interfaces/backendError.interfaces";

export const DepartmentCreatePage = () => {
  const navigate = useNavigate();
  
  const { createDepartment, isCreating } = useCreateDepartment();

  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<Department>({
    defaultValues: {
      name: "",
      acronym: "",
      priority: undefined,
    }
  });

  const onSubmit = async (data: Department) => {
    
    const payload = {
      name: data.name.trim(),
      acronym: data.acronym.trim().toUpperCase(),
      priority: Number(data.priority),
    };

    try {
      await sileo.promise(createDepartment(payload), {
        loading: { 
          title: "Creando departamento...",
        },
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
      
      navigate("/department");

    } catch (error) {
      console.error("Error en la creación:", error);
    }
  };

  return (
    <div className="mx-auto w-full max-w-3xl space-y-4">
      
      <button 
        onClick={() => navigate('/department')}
        type="button"
        className="group flex w-fit items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
        Regresar a Departamentos
      </button>

      <form onSubmit={handleSubmit(onSubmit)} className="rounded-xl border border-border bg-card p-6 shadow-sm">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Building2 className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-foreground leading-none">
                Nuevo Departamento
              </h3>
              <p className="text-sm font-medium text-muted-foreground">
                Ingresa los datos requeridos para el sistema
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6">
          
          {/* Nombre */}
          <div className="sm:col-span-2 space-y-2">
            <Label htmlFor="name" className={cn("text-xs font-bold uppercase tracking-wider text-muted-foreground", errors.name && "text-red-500")}>
              Nombre del Departamento <span className="text-red-500">*</span>
            </Label>
            <Input 
              id="name"
              placeholder="Ej. Subdirección Administrativa"
              className={cn("bg-muted/10", errors.name && "border-red-500 focus-visible:ring-red-500")}
              {...register("name", { 
                required: "El nombre es obligatorio",
                validate: (value) => value.trim().length >= 3 || "Debe tener al menos 3 caracteres reales" 
              })}
            />
            {errors.name && <p className="text-xs font-medium text-red-500">{errors.name.message}</p>}
          </div>

          {/* Acrónimo */}
          <div className="space-y-2">
            <Label htmlFor="acronym" className={cn("text-xs font-bold uppercase tracking-wider text-muted-foreground", errors.acronym && "text-red-500")}>
              Acrónimo <span className="text-red-500">*</span>
            </Label>
            <Input 
              id="acronym"
              placeholder="Ej. SAD"
              className={cn("bg-muted/10 uppercase", errors.acronym && "border-red-500 focus-visible:ring-red-500")}
              {...register("acronym", { 
                required: "El acrónimo es obligatorio",
                validate: (value) => value.trim().length > 0 || "No puede estar vacío"
              })}
            />
            {errors.acronym && <p className="text-xs font-medium text-red-500">{errors.acronym.message}</p>}
          </div>

          {/* Prioridad */}
          <div className="space-y-2">
            <Label htmlFor="priority" className={cn("text-xs font-bold uppercase tracking-wider text-muted-foreground", errors.priority && "text-red-500")}>
              Nivel de Prioridad <span className="text-red-500">*</span>
            </Label>
            <Input 
              id="priority"
              type="number"
              placeholder="Ej. 8"
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
            disabled={isCreating}
          >
            <X className="mr-2 h-4 w-4" />
            Cancelar
          </Button>
          
          <Button 
            type="submit" 
            className="w-full sm:w-auto bg-blue-700 hover:bg-blue-800 text-white"
            disabled={isCreating} 
          >
            <Save className="mr-2 h-4 w-4" />
            {isCreating ? "Guardando..." : "Guardar Departamento"}
          </Button>
        </div>

      </form>
    </div>
  );
};
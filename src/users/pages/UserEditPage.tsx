import { 
  UserCog, 
  ArrowLeft,
  Save,
  X,
  Mail,
  Lock,
  Hash,
  Send,
  EyeOff,
  Eye
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate, useParams } from "react-router";
import { sileo } from "sileo";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AxiosError } from "axios";
import { useState, useEffect } from "react"; // <-- Importamos useEffect

// Hooks
import { useDepartments } from "../hooks/useDepartment";
import { useRoles } from "../hooks/userRoles";
import { useUserUpdate } from "../hooks/useUserUpdate";
import { useUser } from "../hooks/useUser"; 

interface UserFormData {
  email: string;
  password?: string;
  name: string;
  paternalSurname: string;
  maternalSurname: string;
  num_control: string;
  rfc: string;
  idTelegram: string;
  roleId: string;
  departmentId: string;
  coordinationId: string;
}

interface BackendError {
  message: string | string[];
  error: string;
  statusCode: number;
}

export const UserEditPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [showPassword, setShowPassword] = useState(false);
  
  // 1. OBTENEMOS TODOS LOS DATOS
  const { user, isLoading: isLoadingUser } = useUser();
  const { updateUser, isUpdating } = useUserUpdate();
  const { data: departments, isLoading: isLoadingDepts } = useDepartments();
  const { data: roles, isLoading: isLoadingRoles } = useRoles();

  // 2. INICIALIZAMOS EL FORMULARIO EN BLANCO
  const { 
    register, 
    handleSubmit,
    control, 
    reset, // <-- Extraemos la función reset
    formState: { errors } 
  } = useForm<UserFormData>({
    defaultValues: {
      email: "",
      password: "",
      name: "",
      paternalSurname: "",
      maternalSurname: "",
      num_control: "",
      rfc: "",
      idTelegram: "",
      roleId: "",
      departmentId: "",
      coordinationId: "",
    }
  });

  // 3. EL TRUCO MAGICO: Llenamos los datos forzando un reset cuando 'user' ya exista
  useEffect(() => {
    if (user) {
      reset({
        email: user.email || "",
        password: "", // Siempre vacío por seguridad
        name: user.staff?.name || "",
        paternalSurname: user.staff?.paternalSurname || "",
        maternalSurname: user.staff?.maternalSurname || "",
        num_control: user.staff?.num_control || "",
        rfc: user.staff?.rfc || "",
        idTelegram: user.staff?.idTelegram || "",
        roleId: user.role?.id || "",
        departmentId: user.staff?.department?.id || "",
        coordinationId: user.staff?.coordination?.id || "",
      });
    }
  }, [user, reset]); // Solo se ejecuta cuando 'user' termina de cargar

  // 4. VALIDAMOS LA CARGA 
  const isPageLoading = isLoadingUser || isLoadingDepts || isLoadingRoles;

  // 5. PANTALLA DE ESPERA (SKELETONS)
  if (isPageLoading) {
    return (
      <div className="mx-auto w-full max-w-4xl space-y-4">
        <Skeleton className="h-6 w-48" />
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <Skeleton className="h-12 w-64 mb-6" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        </div>
      </div>
    );
  }

  // 6. FUNCIÓN PARA GUARDAR
  const onSubmit = async (data: UserFormData) => {
    if (!id) return;

    const payload: Partial<UserFormData> = {
      email: data.email.trim(),
      name: data.name.trim(),
      paternalSurname: data.paternalSurname.trim(),
      maternalSurname: data.maternalSurname.trim(),
      num_control: data.num_control.trim(),
      roleId: data.roleId,
      departmentId: data.departmentId,
      rfc: data.rfc.trim() || undefined,
      idTelegram: data.idTelegram.trim() || undefined,
      coordinationId: data.coordinationId || undefined,
    };

    if (data.password && data.password.trim() !== "") {
      payload.password = data.password;
    }

    try {
      await sileo.promise(updateUser({ id, data: payload }), {
        loading: { 
          title: "Actualizando usuario...",
        },
        success: { 
          title: "¡Actualizado!", 
          description: "Los cambios se guardaron correctamente.",
          duration: 4000 
        },
        error: (err: unknown) => { 
          const axiosErr = err as AxiosError<BackendError>;
          let backendMessage = "Revisa los datos e intenta de nuevo.";
          
          if (axiosErr.response?.data?.message) {
            const rawMessage = axiosErr.response.data.message;
            backendMessage = Array.isArray(rawMessage) ? rawMessage[0] : rawMessage;
          }

          return {
            title: "Error al actualizar", 
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
      
      navigate("/users");

    } catch (error) {
      console.error("Error en la actualización:", error);
    }
  };

  console.log(departments, user, roles);
  

  // 7. LA VISTA PRINCIPAL
  return (
    <div className="mx-auto w-full max-w-4xl space-y-4">
      
      <button 
        onClick={() => navigate('/users')}
        type="button"
        className="group flex w-fit items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
        Regresar a Usuarios
      </button>

      <form onSubmit={handleSubmit(onSubmit)} className="rounded-xl border border-border bg-card p-6 shadow-sm">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <UserCog className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-foreground leading-none">
                Editar Usuario
              </h3>
              <p className="text-sm font-medium text-muted-foreground">
                Actualiza los datos del empleado y sus credenciales
              </p>
            </div>
          </div>
        </div>

        {/* --- SECCIÓN 1: DATOS PERSONALES --- */}
        <div className="pt-6">
          <h4 className="text-sm font-semibold text-foreground mb-4 border-l-2 border-primary pl-2">Datos Personales</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            
            <div className="space-y-2">
              <Label htmlFor="name" className={cn("text-xs font-bold uppercase tracking-wider text-muted-foreground", errors.name && "text-red-500")}>
                Nombres <span className="text-red-500">*</span>
              </Label>
              <Input 
                id="name"
                className={cn("bg-muted/10", errors.name && "border-red-500 focus-visible:ring-red-500")}
                {...register("name", { required: "Requerido" })}
              />
              {errors.name && <p className="text-xs font-medium text-red-500">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="paternalSurname" className={cn("text-xs font-bold uppercase tracking-wider text-muted-foreground", errors.paternalSurname && "text-red-500")}>
                Primer Apellido <span className="text-red-500">*</span>
              </Label>
              <Input 
                id="paternalSurname"
                className={cn("bg-muted/10", errors.paternalSurname && "border-red-500 focus-visible:ring-red-500")}
                {...register("paternalSurname", { required: "Requerido" })}
              />
              {errors.paternalSurname && <p className="text-xs font-medium text-red-500">{errors.paternalSurname.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="maternalSurname" className={cn("text-xs font-bold uppercase tracking-wider text-muted-foreground", errors.maternalSurname && "text-red-500")}>
                Segundo Apellido <span className="text-red-500">*</span>
              </Label>
              <Input 
                id="maternalSurname"
                className={cn("bg-muted/10", errors.maternalSurname && "border-red-500 focus-visible:ring-red-500")}
                {...register("maternalSurname", { required: "Requerido" })}
              />
              {errors.maternalSurname && <p className="text-xs font-medium text-red-500">{errors.maternalSurname.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="num_control" className={cn("flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground", errors.num_control && "text-red-500")}>
                <Hash className="h-3.5 w-3.5" />
                Num. Control / Nómina <span className="text-red-500">*</span>
              </Label>
              <Input 
                id="num_control"
                className={cn("bg-muted/10", errors.num_control && "border-red-500 focus-visible:ring-red-500")}
                {...register("num_control", { required: "Requerido" })}
              />
              {errors.num_control && <p className="text-xs font-medium text-red-500">{errors.num_control.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="rfc" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                RFC (Opcional)
              </Label>
              <Input 
                id="rfc"
                className="bg-muted/10 uppercase"
                {...register("rfc")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="idTelegram" className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <Send className="h-3.5 w-3.5" />
                ID Telegram (Opcional)
              </Label>
              <Input 
                id="idTelegram"
                className="bg-muted/10"
                {...register("idTelegram")}
              />
            </div>
          </div>
        </div>

        {/* --- SECCIÓN 2: ASIGNACIÓN --- */}
        <div className="pt-6 mt-6 border-t border-border/50">
          <h4 className="text-sm font-semibold text-foreground mb-4 border-l-2 border-primary pl-2">Asignación</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            <div className="space-y-2">
              <Label className={cn("text-xs font-bold uppercase tracking-wider text-muted-foreground", errors.departmentId && "text-red-500")}>
                Departamento <span className="text-red-500">*</span>
              </Label>
              <Controller
                control={control}
                name="departmentId"
                rules={{ required: "Selecciona un departamento" }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className={cn("w-full h-10 bg-muted/10", errors.departmentId && "border-red-500")}>
                      <SelectValue placeholder="Selecciona un departamento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Departamentos Disponibles</SelectLabel>
                        {departments?.map((dept: any) =>(
                            <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.departmentId && <p className="text-xs font-medium text-red-500">{errors.departmentId.message}</p>}
            </div>

            <div className="space-y-2">
              <Label className={cn("text-xs font-bold uppercase tracking-wider text-muted-foreground", errors.roleId && "text-red-500")}>
                Rol en el Sistema <span className="text-red-500">*</span>
              </Label>
              <Controller
                control={control}
                name="roleId"
                rules={{ required: "Selecciona un rol" }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className={cn("w-full h-10 bg-muted/10", errors.roleId && "border-red-500")}>
                      <SelectValue placeholder="Selecciona un rol" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Roles del Sistema</SelectLabel>
                        {roles?.map((role: any) =>(
                          <SelectItem key={role.id} value={role.id}>{role.name}</SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.roleId && <p className="text-xs font-medium text-red-500">{errors.roleId.message}</p>}
            </div>

          </div>
        </div>

        {/* --- SECCIÓN 3: CREDENCIALES --- */}
        <div className="pt-6 mt-6 border-t border-border/50">
          <h4 className="text-sm font-semibold text-foreground mb-4 border-l-2 border-primary pl-2">Credenciales de Acceso</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            <div className="space-y-2">
              <Label htmlFor="email" className={cn("flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground", errors.email && "text-red-500")}>
                <Mail className="h-3.5 w-3.5" />
                Correo Electrónico <span className="text-red-500">*</span>
              </Label>
              <Input 
                id="email"
                type="email"
                className={cn("bg-muted/10", errors.email && "border-red-500 focus-visible:ring-red-500")}
                {...register("email", { 
                  required: "El correo es obligatorio",
                  pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "Correo inválido" }
                })}
              />
              {errors.email && <p className="text-xs font-medium text-red-500">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className={cn("flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground", errors.password && "text-red-500")}>
                <Lock className="h-3.5 w-3.5" />
                Nueva Contraseña
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Dejar en blanco para conservar actual"
                  className={cn("pr-10 bg-muted/10", errors.password && "border-red-500 focus-visible:ring-red-500")}
                  {...register("password", { 
                    minLength: { value: 6, message: "Mínimo 6 caracteres" }
                  })}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs font-medium text-red-500">{errors.password.message}</p>}
            </div>

          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row justify-end gap-3 border-t border-border pt-6">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate('/users')}
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
import { 
  UserPlus, 
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
import { useNavigate } from "react-router";
import { sileo } from "sileo";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,     
  SelectLabel,     
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton"; 
import { useDepartments } from "../hooks/useDepartment";
import { useRoles } from "../hooks/userRoles";
import { AxiosError } from "axios";
import { useState } from "react";
import { useUserCreate } from "../hooks/useUserCreate";
import type { BackendError } from "@/interfaces/backendError.interfaces";
import { useCoordinations } from "../hooks/useCoordinations";

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

export const UserCreatePage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  
  const { createUser, isCreating } = useUserCreate();
  
  const { data: departments, isLoading: isLoadingDepartments } = useDepartments();
  const { data: roles, isLoading: isLoadingRoles } = useRoles();
  const { data: coordinations, isLoading: isLoadingCoordinations } = useCoordinations();

  // Expresiones regulares
  const passwordRegex = /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;
  const lettersOnlyRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
  const alphanumericRegex = /^[a-zA-Z0-9]+$/;
  const rfcRegex = /^[A-Z0-9]+$/;
  const uuidV4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i; // Regex para UUID v4

  const { 
    register, 
    handleSubmit,
    control, 
    watch, // <-- Importamos watch para observar cambios en tiempo real
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

  // Observamos el ID del rol seleccionado
  const selectedRoleId = watch("roleId");

  // Buscamos si el rol seleccionado corresponde a "Coordinador" (ignorando mayúsculas/minúsculas por seguridad)
  const isCoordinador = roles?.find(r => r.id === selectedRoleId)?.name?.toLowerCase() === "coordinador";

  const onSubmit = async (data: UserFormData) => {
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
      idTelegram: isCoordinador ? data.idTelegram?.trim() : undefined,
      coordinationId: isCoordinador ? data.coordinationId : undefined,
    };

    try {
      await sileo.promise(createUser(payload), {
        loading: { title: "Creando usuario..." },
        success: { 
          title: "¡Usuario creado!", 
          description: `${payload.name} se guardó correctamente.`,
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
      
      navigate("/users");

    } catch (error) {
      console.error("Error en la creación:", error);
    }
  };

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

      <form 
        onSubmit={handleSubmit(onSubmit)} 
        autoComplete="off"
        className="rounded-xl border border-border bg-card p-6 shadow-sm"
      >
        
        {/* --- TRAMPA ANTI-AUTOCOMPLETADO --- */}
        <div style={{ width: 0, height: 0, overflow: 'hidden', position: 'absolute', zIndex: -1 }}>
          <input type="text" name="fakeusernameremembered" tabIndex={-1} autoComplete="username" />
          <input type="password" name="fakepasswordremembered" tabIndex={-1} autoComplete="current-password" />
        </div>
        {/* ---------------------------------- */}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <UserPlus className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-foreground leading-none">
                Nuevo Usuario
              </h3>
              <p className="text-sm font-medium text-muted-foreground">
                Ingresa los datos del empleado y sus credenciales
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
                autoComplete="nope"
                placeholder="Ej. Juan Carlos"
                className={cn("bg-muted/10", errors.name && "border-red-500 focus-visible:ring-red-500")}
                {...register("name", { 
                  required: "Requerido",
                  maxLength: { value: 50, message: "Máximo 50 caracteres" },
                  pattern: { value: lettersOnlyRegex, message: "El nombre solo debe contener letras" }
                })}
              />
              {errors.name && <p className="text-xs font-medium text-red-500">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="paternalSurname" className={cn("text-xs font-bold uppercase tracking-wider text-muted-foreground", errors.paternalSurname && "text-red-500")}>
                Primer Apellido <span className="text-red-500">*</span>
              </Label>
              <Input 
                id="paternalSurname"
                autoComplete="nope"
                placeholder="Ej. Rodriguez"
                className={cn("bg-muted/10", errors.paternalSurname && "border-red-500 focus-visible:ring-red-500")}
                {...register("paternalSurname", { 
                  required: "Requerido",
                  maxLength: { value: 50, message: "Máximo 50 caracteres" },
                  pattern: { value: lettersOnlyRegex, message: "El apellido solo debe contener letras" }
                })}
              />
              {errors.paternalSurname && <p className="text-xs font-medium text-red-500">{errors.paternalSurname.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="maternalSurname" className={cn("text-xs font-bold uppercase tracking-wider text-muted-foreground", errors.maternalSurname && "text-red-500")}>
                Segundo Apellido <span className="text-red-500">*</span>
              </Label>
              <Input 
                id="maternalSurname"
                autoComplete="nope"
                placeholder="Ej. Martinez"
                className={cn("bg-muted/10", errors.maternalSurname && "border-red-500 focus-visible:ring-red-500")}
                {...register("maternalSurname", { 
                  required: "Requerido",
                  maxLength: { value: 50, message: "Máximo 50 caracteres" },
                  pattern: { value: lettersOnlyRegex, message: "El apellido solo debe contener letras" }
                })}
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
                autoComplete="nope"
                placeholder="Ej. 20230045"
                className={cn("bg-muted/10", errors.num_control && "border-red-500 focus-visible:ring-red-500")}
                {...register("num_control", { 
                  required: "Requerido",
                  maxLength: { value: 20, message: "Máximo 20 caracteres" },
                  pattern: { value: alphanumericRegex, message: "Evita caracteres especiales" }
                })}
              />
              {errors.num_control && <p className="text-xs font-medium text-red-500">{errors.num_control.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="rfc" className={cn("text-xs font-bold uppercase tracking-wider text-muted-foreground", errors.rfc && "text-red-500")}>
                RFC <span className="text-red-500">*</span>
              </Label>
              <Input 
                id="rfc"
                autoComplete="nope"
                placeholder="XXXX999999XX9"
                className={cn("bg-muted/10 uppercase", errors.rfc && "border-red-500 focus-visible:ring-red-500")}
                {...register("rfc", {
                  required: "El RFC es obligatorio",
                  maxLength: { value: 13, message: "Máximo 13 caracteres" },
                  pattern: { value: rfcRegex, message: "RFC formato inválido (solo mayúsculas y números)" },
                  onChange: (e) => {
                    e.target.value = e.target.value.toUpperCase();
                  }
                })}
              />
              {errors.rfc && <p className="text-xs font-medium text-red-500">{errors.rfc.message}</p>}
            </div>

            {/* --- SE MUESTRA SOLO SI ES COORDINADOR --- */}
            {isCoordinador && (
              <div className="space-y-2 animate-in fade-in zoom-in-95 duration-200">
                <Label htmlFor="idTelegram" className={cn("flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground", errors.idTelegram && "text-red-500")}>
                  <Send className="h-3.5 w-3.5" />
                  ID Telegram <span className="text-red-500">*</span>
                </Label>
                <Input 
                  id="idTelegram"
                  autoComplete="nope"
                  placeholder="Ej. 550e8400-e29b-41d4-a716-446655440000"
                  className={cn("bg-muted/10", errors.idTelegram && "border-red-500 focus-visible:ring-red-500")}
                  {...register("idTelegram", {
                    required: "El ID de Telegram es obligatorio para Coordinadores",
                    pattern: { value: uuidV4Regex, message: "Solo números" }
                  })}
                />
                {errors.idTelegram && <p className="text-xs font-medium text-red-500">{errors.idTelegram.message}</p>}
              </div>
            )}

          </div>
        </div>

        {/* --- SECCIÓN 2: ASIGNACIÓN --- */}
        <div className="pt-6 mt-6 border-t border-border/50">
          <h4 className="text-sm font-semibold text-foreground mb-4 border-l-2 border-primary pl-2">Asignación</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            
            {/* Rol (Lo moví al principio para que sea lo primero que elijan y detone los otros campos) */}
            <div className="space-y-2">
              <Label className={cn("text-xs font-bold uppercase tracking-wider text-muted-foreground", errors.roleId && "text-red-500")}>
                Rol en el Sistema <span className="text-red-500">*</span>
              </Label>
              {isLoadingRoles ? (
                <Skeleton className="h-10 w-full rounded-md bg-muted/50" />
              ) : (
                <Controller
                  control={control}
                  name="roleId"
                  rules={{ required: "Selecciona un rol" }}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value || undefined}>
                      <SelectTrigger className={cn("w-full h-10 bg-muted/10", errors.roleId && "border-red-500")}>
                        <SelectValue placeholder="Selecciona un rol" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Roles del Sistema</SelectLabel>
                          {roles?.map(role =>(
                            <SelectItem key={role.id} value={role.id}>{role.name}</SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
              )}
              {errors.roleId && <p className="text-xs font-medium text-red-500">{errors.roleId.message}</p>}
            </div>

            {/* Departamento */}
            <div className="space-y-2">
              <Label className={cn("text-xs font-bold uppercase tracking-wider text-muted-foreground", errors.departmentId && "text-red-500")}>
                Departamento <span className="text-red-500">*</span>
              </Label>
              {isLoadingDepartments ? (
                <Skeleton className="h-10 w-full rounded-md bg-muted/50" />
              ) : (
                <Controller
                  control={control}
                  name="departmentId"
                  rules={{ required: "Selecciona un departamento" }}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value || undefined}>
                      <SelectTrigger className={cn("w-full h-10 bg-muted/10", errors.departmentId && "border-red-500")}>
                        <SelectValue placeholder="Selecciona un departamento" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Departamentos Disponibles</SelectLabel>
                          {departments?.map(department =>(
                              <SelectItem key={department.id} value={department.id}>{department.name}</SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
              )}
              {errors.departmentId && <p className="text-xs font-medium text-red-500">{errors.departmentId.message}</p>}
            </div>

            {/* --- SE MUESTRA SOLO SI ES COORDINADOR --- */}
            {isCoordinador && (
              <div className="space-y-2 animate-in fade-in zoom-in-95 duration-200">
                <Label className={cn("text-xs font-bold uppercase tracking-wider text-muted-foreground", errors.coordinationId && "text-red-500")}>
                  Coordinación <span className="text-red-500">*</span>
                </Label>
                {isLoadingCoordinations ? (
                  <Skeleton className="h-10 w-full rounded-md bg-muted/50" />
                ) : (
                  <Controller
                    control={control}
                    name="coordinationId"
                    rules={{ required: "Selecciona una coordinación para este rol" }}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value || undefined}>
                        <SelectTrigger className={cn("w-full h-10 bg-muted/10", errors.coordinationId && "border-red-500")}>
                          <SelectValue placeholder="Selecciona una coordinación" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Coordinaciones Disponibles</SelectLabel>
                            {coordinations?.coordinations?.map(coord =>(
                              <SelectItem key={coord.id} value={coord.id}>{coord.name}</SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  />
                )}
                {errors.coordinationId && <p className="text-xs font-medium text-red-500">{errors.coordinationId.message}</p>}
              </div>
            )}

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
                autoComplete="nope"
                placeholder="usuario@oaxaca.tecnm.mx"
                className={cn("bg-muted/10", errors.email && "border-red-500 focus-visible:ring-red-500")}
                {...register("email", { 
                  required: "El correo es obligatorio",
                  maxLength: { value: 100, message: "Máximo 100 caracteres" },
                  pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "El formato del email es inválido" }
                })}
              />
              {errors.email && <p className="text-xs font-medium text-red-500">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className={cn("flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground", errors.password && "text-red-500")}>
                <Lock className="h-3.5 w-3.5" />
                Contraseña <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Mínimo 8 caracteres"
                  className={cn("pr-10 bg-muted/10", errors.password && "border-red-500 focus-visible:ring-red-500")}
                  {...register("password", { 
                    required: "La contraseña es obligatoria",
                    minLength: { value: 8, message: "Password muy corta (min 8)" },
                    maxLength: { value: 50, message: "Máximo 50 caracteres" },
                    pattern: { value: passwordRegex, message: "El password es demasiado débil" }
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
            {isCreating ? "Guardando..." : "Crear Usuario"}
          </Button>
        </div>

      </form>
    </div>
  );
};
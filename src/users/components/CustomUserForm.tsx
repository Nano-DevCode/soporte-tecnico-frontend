import { useState } from "react";
import { useNavigate } from "react-router";
import type { UserFormData } from "../schema/user-form.schema";
import { Controller, useForm } from "react-hook-form";
import { Eye, EyeOff, Hash, Lock, Mail, Save, Send, UserCog, UserPlus, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { alphanumericRegex, lettersOnlyRegex, passwordRegex, rfcRegex } from "../util/regex";
import type { Coordination, CoordinationResponse, User } from "../interfaces/users.response";
import type { Role, RolesResponse } from "../interfaces/roles.response";
import type { Department, DepartmentResponseAll } from "@/departments/interfaces/department.interface";
import { useTranslation } from "react-i18next";

interface CustomUserFormProps {
  mode: "create" | "edit";
  user?: User;
  roles: RolesResponse;
  departments: DepartmentResponseAll;
  coordinations: CoordinationResponse;
  onSubmitCallback: (data: UserFormData) => Promise<void>;
  isMutating: boolean; 
}

export const CustomUserForm = ({ 
  mode, 
  user, 
  roles, 
  departments, 
  coordinations, 
  onSubmitCallback, 
  isMutating 
}: CustomUserFormProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const isEditMode = mode === "edit";
  const { 
    register, 
    handleSubmit,
    control, 
    watch,
    formState: { errors } 
  } = useForm<UserFormData>({
    values: {
      email: user?.email || "",
      password: "", 
      name: user?.staff?.name || "",
      paternalSurname: user?.staff?.paternalSurname || "",
      maternalSurname: user?.staff?.maternalSurname || "",
      num_control: user?.staff?.num_control || "",
      rfc: user?.staff?.rfc || "",
      idTelegram: user?.staff?.idTelegram || "",
      roleId: user?.role?.id || "",
      departmentId: user?.staff?.department?.id || "",
      coordinationId: user?.staff?.coordination?.id || "",
    }
  });
  const selectedRoleId = watch("roleId");
  const isCoordinador = roles?.find((r: Role) => r.id === selectedRoleId)?.name?.toLowerCase() === "coordinador";

  const onFormSubmit = async (data: UserFormData) => {
    await onSubmitCallback(data);
  };

  const getRoleDescription = (roleName: string) => {
    const normalized = roleName.toLowerCase();
    if (normalized.includes("jefe cc")) return t("users.components.customUserForm.roleBossCC");
    if (normalized.includes("coordinador")) return t("users.components.customUserForm.roleCorrdinator");
    if (normalized.includes("jefe departamento")) return t("users.components.customUserForm.roleBoosDept");
    if (normalized.includes("técnico")) return t("users.components.customUserForm.roleTecni");
    if (normalized.includes("secretaria cc")) return t("users.components.customUserForm.roleSecreCC");
    if (normalized.includes("inventario")) return t("users.components.customUserForm.roleInventary");
    if (normalized.includes("visitante")) return t("users.components.customUserForm.roleVisitor");
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} autoComplete="off" className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <div style={{ width: 0, height: 0, overflow: 'hidden', position: 'absolute', zIndex: -1 }}>
        <input type="text" name="fakeusernameremembered" tabIndex={-1} autoComplete="username" aria-label="Usuario falso oculto" aria-hidden="true" />
        <input type="password" name="fakepasswordremembered" tabIndex={-1} autoComplete="current-password" aria-label="Contraseña falsa oculta" aria-hidden="true" />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            {isEditMode ? <UserCog className="h-6 w-6" aria-hidden="true" /> : <UserPlus className="h-6 w-6" aria-hidden="true" />}
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-foreground leading-none">
              {isEditMode ? t("users.components.customUserForm.editUser") : t("users.components.customUserForm.newUser")}
            </h3>
            <p className="text-sm font-medium text-muted-foreground">
              {isEditMode ? t("users.components.customUserForm.editUserDescription") : t("users.components.customUserForm.newUserDescription")}
            </p>
          </div>
        </div>
      </div>

      <div className="pt-6">
        <h4 className="text-sm font-semibold text-foreground mb-4 border-l-2 border-primary pl-2">{t("users.components.customUserForm.personalData")}</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name" className={cn("text-xs font-bold uppercase tracking-wider text-muted-foreground", errors.name && "text-red-500")}>
              {t("users.components.customUserForm.names")}
              <span className="text-red-500">*</span>
            </Label>
            <Input id="name" autoComplete="nope" className={cn("bg-muted/10", errors.name && "border-red-500")} {...register("name", { required: t("users.components.customUserForm.nameRequired"), pattern: { value: lettersOnlyRegex, message: t("users.components.customUserForm.nameError") } })} />
            {errors.name && <p className="text-xs font-medium text-red-500">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="paternalSurname" className={cn("text-xs font-bold uppercase tracking-wider text-muted-foreground", errors.paternalSurname && "text-red-500")}>
              {t("users.components.customUserForm.firstLastName")} <span className="text-red-500">*</span>
            </Label>
            <Input id="paternalSurname" autoComplete="nope" className={cn("bg-muted/10", errors.paternalSurname && "border-red-500")} {...register("paternalSurname", { required: t("users.components.customUserForm.firstLastNameRequired"), pattern: { value: lettersOnlyRegex, message: t("users.components.customUserForm.firstLastNameError") } })} />
            {errors.paternalSurname && <p className="text-xs font-medium text-red-500">{errors.paternalSurname.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="maternalSurname" className={cn("text-xs font-bold uppercase tracking-wider text-muted-foreground", errors.maternalSurname && "text-red-500")}>
              {t("users.components.customUserForm.secondLastName")} <span className="text-red-500">*</span>
            </Label>
            <Input id="maternalSurname" autoComplete="nope" className={cn("bg-muted/10", errors.maternalSurname && "border-red-500")} {...register("maternalSurname", { required: t("users.components.customUserForm.secondLastNameRequired"), pattern: { value: lettersOnlyRegex, message: t("users.components.customUserForm.secondLastNameError") } })} />
            {errors.maternalSurname && <p className="text-xs font-medium text-red-500">{errors.maternalSurname.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="num_control" className={cn("flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground", errors.num_control && "text-red-500")}>
              <Hash className="h-3.5 w-3.5" aria-hidden="true" /> {t("users.components.customUserForm.nControl")} <span className="text-red-500">*</span>
            </Label>
            <Input id="num_control" autoComplete="nope" className={cn("bg-muted/10", errors.num_control && "border-red-500")} {...register("num_control", { required: t("users.components.customUserForm.nControlRequired"), pattern: { value: alphanumericRegex, message: t("users.components.customUserForm.nControlError") } })} />
            {errors.num_control && <p className="text-xs font-medium text-red-500">{errors.num_control.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="rfc" className={cn("text-xs font-bold uppercase tracking-wider text-muted-foreground", errors.rfc && "text-red-500")}>
              {t("users.components.customUserForm.rfc")} <span className="text-red-500">*</span>
            </Label>
            <Input id="rfc" autoComplete="nope" className={cn("bg-muted/10 uppercase", errors.rfc && "border-red-500")} {...register("rfc", { required: t("users.components.customUserForm.rfcRequired"), pattern: { value: rfcRegex, message: t("users.components.customUserForm.rfcError") }, onChange: (e) => e.target.value = e.target.value.toUpperCase() })} />
            {errors.rfc && <p className="text-xs font-medium text-red-500">{errors.rfc.message}</p>}
          </div>

          {isCoordinador && (
            <div className="space-y-2 animate-in fade-in zoom-in-95 duration-200">
              <Label htmlFor="idTelegram" className={cn("flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground", errors.idTelegram && "text-red-500")}>
                <Send className="h-3.5 w-3.5" aria-hidden="true" /> {t("users.components.customUserForm.idTelegram")}
              </Label>
              <Input id="idTelegram" autoComplete="nope" className={cn("bg-muted/10", errors.idTelegram && "border-red-500")} {...register("idTelegram", { /* required: t("users.components.customUserForm.idTelegramRequired"), */ pattern: { value: alphanumericRegex, message: t("users.components.customUserForm.idTelegramError") } })} />
              {errors.idTelegram && <p className="text-xs font-medium text-red-500">{errors.idTelegram.message}</p>}
            </div>
          )}
        </div>
      </div>
      
      <div className="pt-6 mt-6 border-t border-border/50">
        <h4 className="text-sm font-semibold text-foreground mb-4 border-l-2 border-primary pl-2">Asignación</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          
          <div className="space-y-2">
            <Label id="label-role" className={cn("text-xs font-bold uppercase tracking-wider text-muted-foreground", errors.roleId && "text-red-500")}> 
              {t("users.components.customUserForm.role")} <span className="text-red-500">*</span>
            </Label>
            <Controller
              control={control}
              name="roleId"
              rules={{ required: t("users.components.customUserForm.roleRequired") }}
              render={({ field }) => (
                <Select name={field.name} onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                  <SelectTrigger aria-labelledby="label-role" className={cn("w-full h-10 bg-muted/10", errors.roleId && "border-red-500")}>
            
                    <SelectValue placeholder={t("users.components.customUserForm.rolePlaceholder")}>
                      {field.value ? roles?.find((r: Role) => r.id === field.value)?.name : null}
                    </SelectValue>
                    
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {roles?.map((role: Role) => (
                        <SelectItem key={role.id} value={role.id}>
                          <div className="flex flex-col gap-1.5 items-start max-w-70 sm:max-w-87.5 whitespace-normal py-1">
                            <span className="font-semibold leading-none">{role.name}</span>
                            <span className="text-xs text-muted-foreground leading-snug">
                              {getRoleDescription(role.name)}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.roleId && <p className="text-xs font-medium text-red-500">{errors.roleId.message}</p>}
          </div>

          <div className="space-y-2">
            <Label id="label-department" className={cn("text-xs font-bold uppercase tracking-wider text-muted-foreground", errors.departmentId && "text-red-500")}> {t("users.components.customUserForm.department")} <span className="text-red-500">*</span></Label>
            <Controller
              control={control}
              name="departmentId"
              rules={{ required: t("users.components.customUserForm.departmentRequired") }}
              render={({ field }) => (
                <Select name={field.name} onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                  <SelectTrigger aria-labelledby="label-department" className={cn("w-full h-10 bg-muted/10", errors.departmentId && "border-red-500")}>
                    <SelectValue placeholder={t("users.components.customUserForm.departmentPlaceholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {departments?.map((dept: Department) => <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>)}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.departmentId && <p className="text-xs font-medium text-red-500">{errors.departmentId.message}</p>}
          </div>

          {isCoordinador && (
            <div className="space-y-2 animate-in fade-in zoom-in-95 duration-200">
              <Label id="label-coordination" className={cn("text-xs font-bold uppercase tracking-wider text-muted-foreground", errors.coordinationId && "text-red-500")}> {t("users.components.customUserForm.coordination")} <span className="text-red-500">*</span></Label>
              <Controller
                control={control}
                name="coordinationId"
                rules={{ required: t("users.components.customUserForm.coordinationRequired") }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                    <SelectTrigger aria-labelledby="label-coordination" className={cn("w-full h-10 bg-muted/10", errors.coordinationId && "border-red-500")}>
                      <SelectValue placeholder={t("users.components.customUserForm.coordinationPlaceholder")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {coordinations?.map((coord: Coordination) => <SelectItem key={coord.id} value={coord.id}>{coord.name}</SelectItem>)}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.coordinationId && <p className="text-xs font-medium text-red-500">{errors.coordinationId.message}</p>}
            </div>
          )}
        </div>
      </div>

      <div className="pt-6 mt-6 border-t border-border/50">
        <h4 className="text-sm font-semibold text-foreground mb-4 border-l-2 border-primary pl-2">Credenciales de Acceso</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="email" className={cn("flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground", errors.email && "text-red-500")}>
              <Mail className="h-3.5 w-3.5" aria-hidden="true" /> {t("users.components.customUserForm.email")} <span className="text-red-500">*</span>
            </Label>
            <Input id="email" type="email" autoComplete="nope" className={cn("bg-muted/10", errors.email && "border-red-500")} {...register("email", { required: t("users.components.customUserForm.emailRequired"), pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: t("users.components.customUserForm.emailError") } })} />
            {errors.email && <p className="text-xs font-medium text-red-500">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className={cn("flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground", errors.password && "text-red-500")}>
              <Lock className="h-3.5 w-3.5" aria-hidden="true" /> {isEditMode ? t("users.components.customUserForm.passwordNew") : t("users.components.customUserForm.passwordEdit")} {isEditMode ? "" : <span className="text-red-500">*</span>}
            </Label>
            <div className="relative">
              <Input 
                id="password" 
                type={showPassword ? "text" : "password"} 
                autoComplete="new-password" 
                placeholder={isEditMode ? t("users.components.customUserForm.passwordEditPlaceholder") : t("users.components.customUserForm.passwordNewPlaceholder")} 
                className={cn("pr-10 bg-muted/10", errors.password && "border-red-500")} 
                {...register("password", { 
                  required: isEditMode ? false : t("users.components.customUserForm.passwordNewRequired"), 
                  minLength: { value: 8, message: t("users.components.customUserForm.passwordMinLength") }, 
                  pattern: { value: passwordRegex, message: t("users.components.customUserForm.passwordRegexError") } 
                })} 
              />

              <Button 
                type="button" 
                variant="ghost"
                size="icon"
                aria-label={showPassword ? t("hide_password", "Ocultar contraseña") : t("show_password", "Mostrar contraseña")}
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-muted-foreground hover:text-foreground" 
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
              </Button>
            </div>
            {errors.password && <p className="text-xs font-medium text-red-500">{errors.password.message}</p>}
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-col sm:flex-row justify-end gap-3 border-t border-border pt-6">
        <Button type="button" variant="outline" onClick={() => navigate('/users')} className="w-full sm:w-auto" disabled={isMutating}>
          <X className="mr-2 h-4 w-4" aria-hidden="true" /> {t("cancel")}
        </Button>
        <Button type="submit" className="w-full sm:w-auto bg-blue-700 hover:bg-blue-800 text-white" disabled={isMutating}>
          <Save className="mr-2 h-4 w-4" aria-hidden="true" /> 
          {isMutating 
            ? (isEditMode ? t("users.components.customUserForm.editing") : t("users.components.customUserForm.creating")) 
            : (isEditMode ? t("users.components.customUserForm.editingSave") : t("users.components.customUserForm.creatingSave"))}
        </Button>
      </div>
    </form>
  );
};
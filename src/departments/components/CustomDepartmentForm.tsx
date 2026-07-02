import { useForm, Controller } from "react-hook-form";
import { Building2, Save, X, Info, AlertTriangle, Lock } from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { Department } from "../interfaces/department.interface";
import { useTranslation } from "react-i18next";
import { CustomCombobox } from "@/components/custom/CustomCombobox"; 

interface CustomDepartmentFormProps {
  mode: "create" | "edit";
  department?: Department;
  onSubmitCallback: (data: Department) => Promise<void>;
  isMutating: boolean;
}

export const CustomDepartmentForm = ({
  mode,
  department,
  onSubmitCallback,
  isMutating
}: CustomDepartmentFormProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isEditMode = mode === "edit";

  const { 
    register, 
    handleSubmit,
    control,
    setValue,
    formState: { errors, dirtyFields } 
  } = useForm<Department>({
    defaultValues: {
      name: department?.name || "",
      acronym: department?.acronym || "",
      priority: department?.priority || undefined,
      // Se eliminó folio por completo de los valores por defecto
    }
  });

  // Opciones para el Combobox de Prioridad
  const priorityOptions = [
    { value: "1", label: t("departments.components.customDepartmentForm.priorityCritical") },
    { value: "2", label: t("departments.components.customDepartmentForm.priorityHigh") },
    { value: "3", label: t("departments.components.customDepartmentForm.priorityMedium") },
    { value: "4", label: t("departments.components.customDepartmentForm.priorityLow") },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmitCallback)} className="rounded-xl border border-border bg-card p-6 shadow-sm">
      
      {/* ENCABEZADO DINÁMICO */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Building2 className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-foreground leading-none">
              {isEditMode ? t("departments.components.customDepartmentForm.editTitle") : t("departments.components.customDepartmentForm.newTitle")}
            </h3>
            <p className="text-sm font-medium text-muted-foreground">
              {isEditMode 
                ? t("departments.components.customDepartmentForm.editDescription")
                : t("departments.components.customDepartmentForm.newDescription")}
            </p>
          </div>
        </div>
      </div>

      {/* CAMPOS DEL FORMULARIO */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6">
        
        {/* Nombre */}
        <div className="sm:col-span-2 space-y-2">
          <Label htmlFor="name" className={cn("text-xs font-bold uppercase tracking-wider text-muted-foreground", errors.name && "text-red-500")}>
            {t("departments.components.customDepartmentForm.name")} <span className="text-red-500">*</span>
          </Label>
          <Input 
            id="name"
            placeholder="Ej. Subdirección Administrativa"
            className={cn("bg-muted/10", errors.name && "border-red-500 focus-visible:ring-red-500")}
            {...register("name", { 
              required: t("departments.components.customDepartmentForm.nameRequired"),
              validate: (value) => value.trim().length >= 3 || t("departments.components.customDepartmentForm.nameMinLength"),
              onChange: (e) => {
                if (!isEditMode && !dirtyFields.acronym) {
                  const currentValue = e.target.value || "";
                  const generatedAcronym = currentValue
                    .split(" ")
                    .filter((word: string) => word.length > 0)
                    .map((word: string) => word[0].toUpperCase())
                    .join("");
                  
                  setValue("acronym", generatedAcronym, { shouldValidate: true });
                }
              }
            })}
          />
          {errors.name && <p className="text-xs font-medium text-red-500">{errors.name.message}</p>}
        </div>

        {/* Acrónimo */}
        <div className="space-y-2">
          <Label htmlFor="acronym" className={cn("text-xs font-bold uppercase tracking-wider text-muted-foreground", errors.acronym && "text-red-500")}>
            {t("departments.components.customDepartmentForm.acronym")} {!isEditMode && <span className="text-red-500">*</span>}
          </Label>
          <Input 
            id="acronym"
            placeholder="Ej. SAD"
            readOnly={isEditMode}
            className={cn(
              "uppercase", 
              !isEditMode && "bg-muted/10",
              isEditMode && "opacity-60 cursor-not-allowed bg-muted font-medium text-muted-foreground",
              errors.acronym && "border-red-500 focus-visible:ring-red-500"
            )}
            {...register("acronym", { 
              required: t("departments.components.customDepartmentForm.acronymRequired"),
              validate: (value) => value.trim().length > 0 || t("departments.components.customDepartmentForm.acronymMinLength")
            })}
          />
          
          {/* Pistas visuales según el modo */}
          <div className="space-y-1.5 mt-1">
            {!isEditMode && !errors.acronym && (
              <>
                <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Info className="h-3.5 w-3.5 shrink-0" />
                  {t("departments.components.customDepartmentForm.acronymHint")}
                </p>
                <p className="flex items-center gap-1.5 text-xs font-medium text-amber-600 dark:text-amber-500">
                  <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                  {t("departments.components.customDepartmentForm.acronymWarning")}
                </p>
              </>
            )}

            {isEditMode && (
               <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                 <Lock className="h-3.5 w-3.5 shrink-0" />
                 {t("departments.components.customDepartmentForm.acronymLocked")}
               </p>
            )}
          </div>

          {errors.acronym && <p className="text-xs font-medium text-red-500">{errors.acronym.message}</p>}
        </div>

        {/* Prioridad con CustomCombobox y Controller */}
        <div className="space-y-2">
          <Label htmlFor="priority" className={cn("text-xs font-bold uppercase tracking-wider text-muted-foreground", errors.priority && "text-red-500")}>
            {t("departments.components.customDepartmentForm.priority")} <span className="text-red-500">*</span>
          </Label>
          <Controller
            control={control}
            name="priority"
            rules={{ required: t("departments.components.customDepartmentForm.priorityRequired") }}
            render={({ field }) => (
              <CustomCombobox
                options={priorityOptions}
                placeholder={t("departments.components.customDepartmentForm.priorityPlaceholder")}
                emptyText={t("departments.components.customDepartmentForm.priorityEmpty")}
                value={field.value ? String(field.value) : undefined}
                onChange={(val) => field.onChange(Number(val))}
                ref={field.ref}
                error={!!errors.priority}
              />
            )}
          />
          {errors.priority && <p className="text-xs font-medium text-red-500">{errors.priority.message}</p>}
        </div>

        {/* Bloque de Folio eliminado por completo de aquí */}

      </div>

      {/* BOTONES FINALES */}
      <div className="mt-8 flex flex-col sm:flex-row justify-end gap-3 border-t border-border pt-6">
        <Button  
          type="button" 
          variant="outline" 
          onClick={() => navigate('/departments')}
          className="w-full sm:w-auto"
          disabled={isMutating}
        >
          <X className="mr-2 h-4 w-4" /> {t("departments.components.customDepartmentForm.cancel")}
        </Button>
        
        <Button 
          type="submit" 
          className="w-full sm:w-auto bg-blue-700 hover:bg-blue-800 text-white"
          disabled={isMutating} 
        >
          <Save className="mr-2 h-4 w-4" />
          {isMutating 
            ? (isEditMode ? t("departments.components.customDepartmentForm.updating") : t("departments.components.customDepartmentForm.creating")) 
            : (isEditMode ? t("departments.components.customDepartmentForm.saveChanges") : t("departments.components.customDepartmentForm.saveDepartment"))}
        </Button>
      </div>
    </form>
  );
};
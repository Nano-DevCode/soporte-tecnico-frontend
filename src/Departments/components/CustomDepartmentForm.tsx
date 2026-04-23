import { useForm } from "react-hook-form";
import { Building2, Save, X } from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { Department } from "../interfaces/department.interface";
import { t } from "i18next";

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
  const navigate = useNavigate();
  const isEditMode = mode === "edit";

  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<Department>({
    defaultValues: {
      name: department?.name || "",
      acronym: department?.acronym || "",
      priority: department?.priority || undefined,
      folio: department?.folio || undefined,
    }
  });

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
              {isEditMode ? t("custom_department_form_edit_title") : t("custom_department_form_new_title")}
            </h3>
            <p className="text-sm font-medium text-muted-foreground">
              {isEditMode 
                ? t("custom_department_form_edit_description")
                : t("custom_department_form_new_description")}
            </p>
          </div>
        </div>
      </div>

      {/* CAMPOS DEL FORMULARIO */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6">
        
        {/* Nombre */}
        <div className="sm:col-span-2 space-y-2">
          <Label htmlFor="name" className={cn("text-xs font-bold uppercase tracking-wider text-muted-foreground", errors.name && "text-red-500")}>
            {t("custom_department_form_name")} <span className="text-red-500">*</span>
          </Label>
          <Input 
            id="name"
            placeholder="Ej. Subdirección Administrativa"
            className={cn("bg-muted/10", errors.name && "border-red-500 focus-visible:ring-red-500")}
            {...register("name", { 
              required: t("custom_department_form_name_required"),
              validate: (value) => value.trim().length >= 3 || t("custom_department_form_name_min_lenght") 
            })}
          />
          {errors.name && <p className="text-xs font-medium text-red-500">{errors.name.message}</p>}
        </div>

        {/* Acrónimo */}
        <div className="space-y-2">
          <Label htmlFor="acronym" className={cn("text-xs font-bold uppercase tracking-wider text-muted-foreground", errors.acronym && "text-red-500")}>
            {t("custom_department_form_acronym")} <span className="text-red-500">*</span>
          </Label>
          <Input 
            id="acronym"
            placeholder="Ej. SAD"
            className={cn("bg-muted/10 uppercase", errors.acronym && "border-red-500 focus-visible:ring-red-500")}
            {...register("acronym", { 
              required: t("custom_department_form_acronym_required"),
              validate: (value) => value.trim().length > 0 || t("custom_department_form_acronym_min_lenght")
            })}
          />
          {errors.acronym && <p className="text-xs font-medium text-red-500">{errors.acronym.message}</p>}
        </div>

        {/* Prioridad */}
        <div className="space-y-2">
          <Label htmlFor="priority" className={cn("text-xs font-bold uppercase tracking-wider text-muted-foreground", errors.priority && "text-red-500")}>
            {t("custom_department_form_priority")} <span className="text-red-500">*</span>
          </Label>
          <Input 
            id="priority"
            type="number"
            placeholder="Ej. 8"
            className={cn("bg-muted/10", errors.priority && "border-red-500 focus-visible:ring-red-500")}
            {...register("priority", { 
              required: t("custom_department_form_priority_required"),
              min: { value: 1, message: t("custom_department_form_priority_min") },
              max: { value: 10, message: t("custom_department_form_priority_max") }
            })}
          />
          {errors.priority && <p className="text-xs font-medium text-red-500">{errors.priority.message}</p>}
        </div>

        {/* Folio (Solo en modo Edición) */}
        {isEditMode && (
          <div className="space-y-2">
            <Label htmlFor="folio" className={cn("text-xs font-bold uppercase tracking-wider text-muted-foreground", errors.folio && "text-red-500")}>
              {t("custom_department_form_folio")} <span className="text-red-500">*</span>
            </Label>
            <Input 
              id="folio"
              type="number"
              className={cn("bg-muted/10", errors.folio && "border-red-500 focus-visible:ring-red-500")}
              {...register("folio", { 
                required: t("custom_department_form_folio_requered"),
                min: { value: 1, message: t("custom_department_form_folio_min") }
              })}
            />
            {errors.folio && <p className="text-xs font-medium text-red-500">{errors.folio.message}</p>}
          </div>
        )}

      </div>

      {/* BOTONES FINALES */}
      <div className="mt-8 flex flex-col sm:flex-row justify-end gap-3 border-t border-border pt-6">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => navigate('/department')}
          className="w-full sm:w-auto"
          disabled={isMutating}
        >
          <X className="mr-2 h-4 w-4" /> {t("cancel")}
        </Button>
        
        <Button 
          type="submit" 
          className="w-full sm:w-auto bg-blue-700 hover:bg-blue-800 text-white"
          disabled={isMutating} 
        >
          <Save className="mr-2 h-4 w-4" />
          {isMutating 
            ? (isEditMode ? t("updating") : t("creating")) 
            : (isEditMode ? t("custom_department_form_save_changues") : t("custom_department_form_save_department"))}
        </Button>
      </div>
    </form>
  );
};
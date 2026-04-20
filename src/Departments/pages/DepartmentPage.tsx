import { useState, useCallback, useMemo } from "react";
import { Users, AlertTriangle, ArrowUpCircle, Plus } from "lucide-react";
import { Link } from "react-router";

import { CustomDepartmentDesktopTable } from "../components/CustomDepartmentDesktopTable";
import { CustomDepartmentMobileCard } from "../components/CustomDepartmentMobileCard";
import { CustomDepartmentFilters } from "../components/CustomDepartmentFilters";
import { useDepartments } from "../hooks/useDepartments";
import type { Department } from "../interfaces/department.interface";

import { CustomDialogConfirm } from "@/components/custom/CustomDialogCorfirm";
import { CustomPagination } from "@/components/custom/CustomPagination";
import { CustomSkeletonTableCard } from "@/components/custom/CustomSkeletonTableCard";
import { CustomTitleCard } from "@/components/custom/CustomTitleCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const DepartmentPage = () => {
  const { departments, meta, isLoading: skelettonLoading, isUpdating, changeStatus } = useDepartments();
  
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [departmentSelect, setDepartmentSeleccionado] = useState<Department | null>(null);

  const handleDownClick = useCallback((department: Department) => {
    setDepartmentSeleccionado(department);
    setStatusDialogOpen(true);
  }, []);

  const handleDownConfirm = async () => {
    if (!departmentSelect) return;

    try {
      await changeStatus({ 
        id: departmentSelect.id || "", 
        status: !departmentSelect.status 
      });
      setStatusDialogOpen(false);
    } catch (error) {
      console.error("Error al actualizar el estado:", error);
    }
  };

  const dialogDescription = useMemo(() => {
    if (!departmentSelect) return null;

    return (
      <div className="space-y-2">
        <div className={cn(
          "rounded-lg p-3 border",
          departmentSelect.status 
            ? "bg-red-50 dark:bg-red-950/30 border-red-100 dark:border-red-900/50" 
            : "bg-blue-50 dark:bg-blue-950/30 border-blue-100 dark:border-blue-900/50"
        )}>
          <p className={cn(
            "font-bold text-lg",
            departmentSelect.status ? "text-red-700 dark:text-red-400" : "text-blue-700 dark:text-blue-400"
          )}>
            {departmentSelect.name ?? 'Nombre no disponible'}
          </p>
          <p className={cn(
            "text-[10px] font-mono mt-1",
            departmentSelect.status ? "text-red-600/70 dark:text-red-400/50" : "text-blue-600/70 dark:text-blue-400/50"
          )}>
            ID: {departmentSelect.id}
          </p>
        </div>

        <p className="text-sm italic pt-1 text-muted-foreground">
          {departmentSelect.status 
            ? "Esta acción impedirá que el departamento sea asignado a nuevos registros."
            : "Esta acción permitirá que el departamento vuelva a aparecer en las listas de selección."}
        </p>
      </div>
    );
  }, [departmentSelect]);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        
        {/* Lado izquierdo */}
        <CustomTitleCard icon={Users} title="Gestión de Departamentos" description="Administra los departamentos del sistema"/>
        
        {/* Botón */}
        <Link to="/department/create">
          <Button className="w-full sm:w-auto bg-blue-700 hover:bg-blue-800">
            <Plus className="mr-2 h-4 w-4" />
            Crear Departamento
          </Button>
        </Link>

      </div>
      
      <CustomDialogConfirm
        open={statusDialogOpen}
        isLoading={isUpdating}
        variant={departmentSelect?.status ? "danger" : "primary"}
        title={departmentSelect?.status ? "Confirmar baja del departamento" : "Confirmar alta del departamento"}
        description={dialogDescription}
        icon={departmentSelect?.status ? AlertTriangle : ArrowUpCircle} 
        onConfirm={handleDownConfirm}
        onOpenChange={setStatusDialogOpen}
        confirmText={departmentSelect?.status ? "Sí, dar de baja" : "Sí, dar de alta"}
        cancelText="Cancelar"
      />

      <CustomDepartmentFilters/>

      {skelettonLoading ? (
        <CustomSkeletonTableCard/>
      ) : (
        <>
          <CustomDepartmentDesktopTable
            departments={departments}
            handleDownClick={handleDownClick}
          />
          <CustomDepartmentMobileCard 
            departments={departments} 
            handleDownClick={handleDownClick} 
          />
          <CustomPagination totalPages={meta?.lastPage ?? 0} />
        </>
      )}
    </div>
  );
}
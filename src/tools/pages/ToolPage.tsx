import { CustomTitleCard } from "@/components/custom/CustomTitleCard";
import { useTools } from "../hooks/useTools";
import { AlertTriangle, ArrowUpCircle, Plus, ToolCase } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { t } from "i18next";
import { CustomDialogConfirm } from "@/components/custom/CustomDialogCorfirm";
import { CustomToolDesktopTable } from "../components/CustomToolDesktopTable";
import { CustomToolMobileCard } from "../components/CustomToolMobileCard";
import { CustomSkeletonTableCard } from "@/components/custom/CustomSkeletonTableCard";
import { CustomPagination } from "@/components/custom/CustomPagination";
import { CustomToolFilters } from "../components/CustomToolFilters";
import type { Tool } from "../interfaces/toolsResponse";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";

export function ToolPage() {

  const { isLoading, tools, changeStatusAsync, isChangingStatus, meta } = useTools();

  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [toolSelect, setToolSeleccionado] = useState<Tool | null>(null);

  const handleDownClick = useCallback((tool: Tool) => {
    setToolSeleccionado(tool);
    setStatusDialogOpen(true);
  }, []);

  const handleDownConfirm = async () => {
    if (!toolSelect) return;

    try {
      await changeStatusAsync({ 
        id: toolSelect.id || "", 
        status: !toolSelect.status 
      });
      setStatusDialogOpen(false);
    } catch (error) {
      console.error("Error al actualizar el estado:", error);
    }
  };

  const dialogDescription = useMemo(() => {
    if (!toolSelect) return null;

    return (
      <div className="space-y-2">
        <div className={cn(
          "rounded-lg p-3 border",
          toolSelect.status 
            ? "bg-red-50 dark:bg-red-950/30 border-red-100 dark:border-red-900/50" 
            : "bg-blue-50 dark:bg-blue-950/30 border-blue-100 dark:border-blue-900/50"
        )}>
          <p className={cn(
            "font-bold text-lg",
            toolSelect.status ? "text-red-700 dark:text-red-400" : "text-blue-700 dark:text-blue-400"
          )}>
            {toolSelect.model.name ?? t("department_page_name_un_available")}
          </p>
          <p className={cn(
            "text-[10px] font-mono mt-1",
            toolSelect.status ? "text-red-600/70 dark:text-red-400/50" : "text-blue-600/70 dark:text-blue-400/50"
          )}>
            {t("department_page_id")} {toolSelect.id}
          </p>
        </div>

        <p className="text-sm italic pt-1 text-muted-foreground">
          {toolSelect.status 
            ? t("department_page_down_department")
            : t("department_page_up_department")}
        </p>
      </div>
    );
  }, [toolSelect]);
  
  return(
    <div className="space-y-6">

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
  
      <CustomTitleCard 
        title="Herramientas" 
        description="Gestión de herramientas" 
        icon={ToolCase}
      />

      <Link to="/tools/new">
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Crear Herramienta
        </Button>
      </Link>

    </div>

      <CustomDialogConfirm
        open={statusDialogOpen}
        isLoading={isChangingStatus}
        variant={toolSelect?.status ? "danger" : "primary"}
        title={toolSelect?.status ? t("department_page_confirm_down"): t("department_page_confirm_up")}
        description={dialogDescription}
        icon={toolSelect?.status ? AlertTriangle : ArrowUpCircle} 
        onConfirm={handleDownConfirm}
        onOpenChange={setStatusDialogOpen}
        confirmText={toolSelect?.status ? "Sí, dar de baja" : "Sí, dar de alta"}
        cancelText= {t("department_page_cancel")}
      />

      <CustomToolFilters />

      {isLoading ? (
          <CustomSkeletonTableCard/>
        ) : (
          <>
            <CustomToolDesktopTable
              tools={tools}
              handleDownClick={handleDownClick}
            />

            <CustomToolMobileCard 
              tools={tools}
              handleDownClick={handleDownClick}
            />

            <CustomPagination totalPages={meta?.lastPage ?? 0} />
          </>
        )
      }

    </div>
  )
}
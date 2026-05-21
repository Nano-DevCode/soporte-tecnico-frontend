import { CustomTitleCard } from "@/components/custom/CustomTitleCard";
import { useTools } from "../hooks/useTools";
import { AlertTriangle, ArrowUpCircle, Plus, ToolCase, Briefcase } from "lucide-react";
import { useCallback, useMemo, useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { t } from "i18next";
import { CustomDialogConfirm } from "@/components/custom/CustomDialogCorfirm";
import { CustomSkeletonTableCard } from "@/components/custom/CustomSkeletonTableCard";
import { CustomPagination } from "@/components/custom/CustomPagination";
import { CustomToolFilters } from "../components/CustomToolFilters";
import type { Tool } from "../interfaces/toolsResponse";
import { Link, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { sileo } from "sileo";
import { isAxiosError } from "axios";
import type { BackendError } from "@/interfaces/backendError.interfaces";
import { logError } from "@/utils/logger";
import { CustomToolDesktopCatalog } from "../components/CustomToolDesktopCatalog";
import { TOOL_BAG_EVENT } from "../components/CustomToolBag"; 

export function ToolPage() {
  const navigate = useNavigate();
  const { isLoading, tools, changeStatusAsync, isChangingStatus, meta } = useTools();

  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [toolSelect, setToolSeleccionado] = useState<Tool | null>(null);

  const [bagCount, setBagCount] = useState(() => {
    // Leemos el localStorage solo una vez al montar el componente
    const currentBag: string[] = JSON.parse(localStorage.getItem("custom_tool_bag") || "[]");
    return currentBag.length;
  });

  useEffect(() => {
    // Escuchamos los cambios futuros (cuando se agrega o quita algo)
    const handleBagUpdate = () => {
      const currentBag: string[] = JSON.parse(localStorage.getItem("custom_tool_bag") || "[]");
      setBagCount(currentBag.length);
    };

    window.addEventListener(TOOL_BAG_EVENT, handleBagUpdate);
    return () => window.removeEventListener(TOOL_BAG_EVENT, handleBagUpdate);
  }, []);

  const handleDownClick = useCallback((tool: Tool) => {
    setToolSeleccionado(tool);
    setStatusDialogOpen(true);
  }, []);

  const handleDownConfirm = async () => {
    if (!toolSelect) return;

    const payload = {
      id: toolSelect.id,
      status: !toolSelect.status,
    }

    try {
      await sileo.promise(changeStatusAsync(payload), {
        loading: { title: t("tools.mainPage.sileo.loading.title") },
        success: {
          title: t("tools.mainPage.sileo.success.title"),
          description: t("tools.mainPage.sileo.success.description"),
          duration: 4000,
        },
        error: (err) => {
          let backendMessage = t("generic_error_backend_message");
          if (isAxiosError<BackendError>(err) && err.response?.data?.message) {
            const rawMessage = err.response.data.message;
            backendMessage = Array.isArray(rawMessage) ? rawMessage[0] : rawMessage;
          }
          return {
            title: t("tools.mainPage.sileo.error.title"),
            description: backendMessage,
            duration: 5000,
          };
        }
      })
      setStatusDialogOpen(false);
    } catch (error) {
      logError(error, "ToolPage.handleDownConfirm");
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
            {t("tools.mainPage.dialog.model")} {toolSelect.model.name} -
            {t("tools.mainPage.dialog.brand")} {toolSelect.model.brand.name}
          </p>
          <p className={cn(
            "text-[10px] font-mono mt-1",
            toolSelect.status ? "text-red-600/70 dark:text-red-400/50" : "text-blue-600/70 dark:text-blue-400/50"
          )}>
            {t("tools.mainPage.dialog.id")} {toolSelect.id}
          </p>
        </div>

        <p className="text-sm italic pt-1 text-muted-foreground">
          {toolSelect.status 
            ? t("tools.mainPage.dialog.textDescriptionDown")
            : t("tools.mainPage.dialog.textDescriptionUp")}
        </p>
      </div>
    );
  }, [toolSelect]);
  
  return(
    <div className="space-y-6">

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
  
        <CustomTitleCard 
          title={t("tools.mainPage.titleCard.title")}
          description={t("tools.mainPage.titleCard.description")}
          icon={ToolCase}
        />

        <div className="flex items-center gap-3">
          
          <Button 
            variant="outline" 
            className="relative"
            onClick={() => navigate("/tools/catalog")} 
          >
            <Briefcase className="mr-2 h-4 w-4" />
            { "Bolsa" }
            
            {bagCount > 0 && (
              <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground animate-in zoom-in">
                {bagCount}
              </span>
            )}
          </Button>

          {/* BOTÓN ORIGINAL DE CREAR */}
          <Link to="/tools/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              {t("tools.mainPage.buttonCreate.label")}
            </Button>
          </Link>
        </div>

      </div>

      <CustomDialogConfirm
        open={statusDialogOpen}
        isLoading={isChangingStatus}
        variant={toolSelect?.status ? "danger" : "primary"}
        title={toolSelect?.status ? t("tools.mainPage.dialog.titleDown"): t("tools.mainPage.dialog.titleUp")}
        description={dialogDescription}
        icon={toolSelect?.status ? AlertTriangle : ArrowUpCircle} 
        onConfirm={handleDownConfirm}
        onOpenChange={setStatusDialogOpen}
        confirmText={toolSelect?.status ? t("tools.mainPage.dialog.buttonConfirmDown") : t("tools.mainPage.dialog.buttonConfirmUp")}
        cancelText= {t("tools.mainPage.dialog.buttonCancel")}
      />

      <CustomToolFilters />

      {isLoading ? (
          <CustomSkeletonTableCard/>
        ) : (
          <>
            <CustomToolDesktopCatalog
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
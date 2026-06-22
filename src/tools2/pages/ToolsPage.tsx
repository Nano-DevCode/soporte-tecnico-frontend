import { CustomTitleCard } from "@/components/custom/CustomTitleCard";
import { useTools } from "../hooks/useTools";
import { AlertTriangle, ArrowUpCircle, Plus, ToolCase } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { CustomDialogConfirm } from "@/components/custom/CustomDialogCorfirm";
import { CustomPagination } from "@/components/custom/CustomPagination";
import { CustomToolDesktopCatalog } from "../components/CustomToolDesktopCatalog";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { sileo } from "sileo";
import { isAxiosError } from "axios";
import type { BackendError } from "@/interfaces/backendError.interfaces";
import { logError } from "@/utils/logger";
import type { Tool } from "../interfaces/toolsResponse.interface";
import { CustomItAssetDesktopCatalogSkeleton } from "@/components/custom/CustomItAssetDesktopCatalogSkeleton";
import { CustomToolFilters } from "../components/CustomToolFilters";

const ToolsPage = () => {
  const { t } = useTranslation();
  const { isLoading, tools, changeStatusAsync, isChangingStatus, meta } = useTools();

  console.log("=== DEBUG CATÁLOGO DESKTOP ===");
  console.log("Lista completa de herramientas:", tools);
  if (tools.length > 0) console.log("Primera herramienta:", tools[0]);

  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [toolSelect, setToolSelect] = useState<Tool | null>(null);

  const handleDownClick = useCallback((tool: Tool) => {
    setToolSelect(tool);
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
          let backendMessage = t("tools.mainPage.sileo.error.defaultMessage");
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
      logError(error, "ToolsPage.handleDownConfirm");
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
            {t("tools.mainPage.dialog.model")} {toolSelect.model?.name} -
            {t("tools.mainPage.dialog.brand")} {toolSelect.model?.brand?.name}
          </p>
          <p className={cn(
            "text-[10px] font-mono mt-1",
            toolSelect.status ? "text-red-600/70 dark:text-red-400/50" : "text-blue-600/70 dark:text-blue-400/50"
          )}>
            {t("tools.mainPage.dialog.id")} {toolSelect.idInventary}
          </p>
        </div>

        <p className="text-sm italic pt-1 text-muted-foreground">
          {toolSelect.status 
            ? t("tools.mainPage.dialog.textDescriptionDown")
            : t("tools.mainPage.dialog.textDescriptionUp")}
        </p>
      </div>
    );
  }, [toolSelect, t]);
  
  return(
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
  
        <CustomTitleCard 
          title={t("tools.mainPage.titleCard.title")}
          description={t("tools.mainPage.titleCard.description")}
          icon={ToolCase}
        />

        <div className="flex items-center gap-3">
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
          <CustomItAssetDesktopCatalogSkeleton/>
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

export default ToolsPage;
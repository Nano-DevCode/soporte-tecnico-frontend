import { CustomTitleCard } from "@/components/custom/CustomTitleCard";
import { useItAssets } from "../hooks/useItAssets";
import { AlertTriangle, ArrowUpCircle, Plus, ToolCase } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { t } from "i18next";
import { CustomDialogConfirm } from "@/components/custom/CustomDialogCorfirm";
import { CustomPagination } from "@/components/custom/CustomPagination";
import { CustomItAssetDesktopCatalog } from "../components/CustomItAssetDesktopCatalog";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { sileo } from "sileo";
import { isAxiosError } from "axios";
import type { BackendError } from "@/interfaces/backendError.interfaces";
import { logError } from "@/utils/logger";
import type { ItAsset } from "../interfaces/itAssetsResponse.interface";
import { CustomItAssetDesktopCatalogSkeleton } from "@/components/custom/CustomItAssetDesktopCatalogSkeleton";
import { CustomItAssetFilters } from "../components/CustomItAssetFilters";

export function ItAssetsPage() {
  const { isLoading, itAssets, changeStatusAsync, isChangingStatus, meta } = useItAssets();

  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [assetSelect, setAssetSelect] = useState<ItAsset | null>(null);

  const handleDownClick = useCallback((asset: ItAsset) => {
    setAssetSelect(asset);
    setStatusDialogOpen(true);
  }, []);

  const handleDownConfirm = async () => {
    if (!assetSelect) return;

    const payload = {
      id: assetSelect.id,
      status: !assetSelect.status,
    }

    try {
      await sileo.promise(changeStatusAsync(payload), {
        loading: { title: t("itAssets.mainPage.sileo.loading.title") },
        success: {
          title: t("itAssets.mainPage.sileo.success.title"),
          description: t("itAssets.mainPage.sileo.success.description"),
          duration: 4000,
        },
        error: (err) => {
          let backendMessage = t("generic_error_backend_message");
          if (isAxiosError<BackendError>(err) && err.response?.data?.message) {
            const rawMessage = err.response.data.message;
            backendMessage = Array.isArray(rawMessage) ? rawMessage[0] : rawMessage;
          }
          return {
            title: t("itAssets.mainPage.sileo.error.title"),
            description: backendMessage,
            duration: 5000,
          };
        }
      })
      setStatusDialogOpen(false);
    } catch (error) {
      logError(error, "ItAssetsPage.handleDownConfirm");
    }
  };

  const dialogDescription = useMemo(() => {
    if (!assetSelect) return null;

    return (
      <div className="space-y-2">
        <div className={cn(
          "rounded-lg p-3 border",
          assetSelect.status 
            ? "bg-red-50 dark:bg-red-950/30 border-red-100 dark:border-red-900/50" 
            : "bg-blue-50 dark:bg-blue-950/30 border-blue-100 dark:border-blue-900/50"
        )}>
          <p className={cn(
            "font-bold text-lg",
            assetSelect.status ? "text-red-700 dark:text-red-400" : "text-blue-700 dark:text-blue-400"
          )}>
            {t("itAssets.mainPage.dialog.model")} {assetSelect.model?.name} -
            {t("itAssets.mainPage.dialog.brand")} {assetSelect.model?.brand?.name}
          </p>
          <p className={cn(
            "text-[10px] font-mono mt-1",
            assetSelect.status ? "text-red-600/70 dark:text-red-400/50" : "text-blue-600/70 dark:text-blue-400/50"
          )}>
            {t("itAssets.mainPage.dialog.id")} {assetSelect.idInventary}
          </p>
        </div>

        <p className="text-sm italic pt-1 text-muted-foreground">
          {assetSelect.status 
            ? t("itAssets.mainPage.dialog.textDescriptionDown")
            : t("itAssets.mainPage.dialog.textDescriptionUp")}
        </p>
      </div>
    );
  }, [assetSelect]);
  
  return(
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
  
        <CustomTitleCard 
          title={t("itAssets.mainPage.titleCard.title")}
          description={t("itAssets.mainPage.titleCard.description")}
          icon={ToolCase}
        />

        <div className="flex items-center gap-3">
          <Link to="/it-assets/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              {t("itAssets.mainPage.buttonCreate.label")}
            </Button>
          </Link>
        </div>

      </div>

      <CustomDialogConfirm
        open={statusDialogOpen}
        isLoading={isChangingStatus}
        variant={assetSelect?.status ? "danger" : "primary"}
        title={assetSelect?.status ? t("itAssets.mainPage.dialog.titleDown"): t("itAssets.mainPage.dialog.titleUp")}
        description={dialogDescription}
        icon={assetSelect?.status ? AlertTriangle : ArrowUpCircle} 
        onConfirm={handleDownConfirm}
        onOpenChange={setStatusDialogOpen}
        confirmText={assetSelect?.status ? t("itAssets.mainPage.dialog.buttonConfirmDown") : t("itAssets.mainPage.dialog.buttonConfirmUp")}
        cancelText= {t("itAssets.mainPage.dialog.buttonCancel")}
      />

      <CustomItAssetFilters />

      {isLoading ? (
          <CustomItAssetDesktopCatalogSkeleton/>
        ) : (
          <>
            <CustomItAssetDesktopCatalog
              itAssets={itAssets}
              handleDownClick={handleDownClick}
            />
            <CustomPagination totalPages={meta?.lastPage ?? 0} />
          </>
        )
      }

    </div>
  )
}
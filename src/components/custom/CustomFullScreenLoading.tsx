import { useTranslation } from "react-i18next"

export const CustomFullScreenLoading = () => {
  const { t } = useTranslation();
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="rounded-2xl bg-card p-8 shadow-xl flex flex-col items-center gap-6">
        
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary/30 border-t-primary"></div>

        <div className="text-center">
          <p className="text-lg font-semibold">{t("custom_full_screen_loading_loading")}</p>
          <p className="text-sm text-muted-foreground animate-pulse">
            {t("custom_full_screen_loading_loading_description")}
          </p>
        </div>

      </div>
    </div>
  )
}
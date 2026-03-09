import { Heart, Clock, Mail, School } from "lucide-react";
import { useTranslation } from 'react-i18next';

export const CustomFooter = () => {
  const { t } = useTranslation();
  return (
    <footer className="w-full">
      <div className="border-t p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center bg-muted p-3 rounded-lg">
          
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-background text-primary shadow-sm">
              <School className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-foreground leading-tight">
                {t("custom_footer_center_computer_department")}
              </span>
              <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
                {t("name_ito")}
              </span>
            </div>
          </div>

          <div className="flex flex-col justify-center gap-1.5 px-0 md:px-4 md:border-l md:border-r border-border/50">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">
                {t("custom_footer_attention_hours")}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Mail className="h-3.5 w-3.5 shrink-0" />
              <a href="mailto:soporte@ito.edu.mx" className="hover:text-primary transition-colors truncate">
                {t("custom_footer_attention_email")}
              </a>
            </div>
          </div>

          <div className="flex flex-col items-center md:items-end justify-center gap-1">
             <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                <span>{t("made_with")}</span>
                <Heart className="h-3.5 w-3.5 fill-red-500 text-red-500 animate-pulse" />
                <span>{t("by_made_center_computer_department")}</span>
             </div>
             <span className="text-[10px] text-muted-foreground/60 text-center md:text-right">
                {t("custom_footer_all_rights_reserved_for_center_computer_department")}
             </span>
          </div>

        </div>
      </div>
    </footer>
  )
}
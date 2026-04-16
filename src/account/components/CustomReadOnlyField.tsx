import { Label } from "@/components/ui/label";
import { t } from "i18next";
import type { LucideIcon } from "lucide-react";

interface ReadOnlyFieldProps {
  icon: LucideIcon;
  label: string;
  value?: string | null;
}

export const CustomReadOnlyField = ({ icon: Icon, label, value }: ReadOnlyFieldProps) => {
  return (
    <div className="space-y-1.5 flex flex-col">
      {/* Label gris adaptativo */}
      <Label className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
        <Icon className="h-4 w-4 text-muted-foreground/70 shrink-0" aria-hidden="true" /> 
        {label}
      </Label>
      
      <div 
        className="min-h-[44px] w-full px-3 py-2.5 bg-muted/50 border border-input rounded-md text-sm font-medium text-foreground flex items-center break-all sm:break-words selection:bg-primary/20 selection:text-primary"
      >
        {value ? (
          value
        ) : (
          <span className="text-muted-foreground/60 italic">{t("custom_read_only_field")}</span>
        )}
      </div>
    </div>
  );
};
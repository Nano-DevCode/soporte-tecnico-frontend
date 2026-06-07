import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  title: string;
  description: string;
  icon: LucideIcon;
  className?: string; // Por si quieres ajustar la altura desde afuera
}

const CustomNotFoundCatalog = ({ title, description, icon: Icon, className }: Props) => {
  return (
    <div 
      className={cn(
        "flex flex-col items-center justify-center w-full min-h-[350px] p-8",
        "rounded-xl border-2 border-dashed border-border/60 bg-muted/10",
        "animate-in fade-in duration-500",
        className
      )}
    >
      <div className="flex flex-col items-center gap-4 text-center max-w-md">
        
        {/* Contenedor del ícono */}
        <div className="h-16 w-16 rounded-full bg-background flex items-center justify-center border border-border/80 shadow-sm">
          <Icon className="h-7 w-7 text-muted-foreground/60" />
        </div>
        
        {/* Textos */}
        <div className="space-y-1.5">
          <p className="text-lg font-semibold text-foreground tracking-tight">
            {title}
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>
        
      </div>
    </div>
  );
}

export default CustomNotFoundCatalog;
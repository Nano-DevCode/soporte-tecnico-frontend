import { memo } from "react"; // <-- Importamos memo
import type { LucideIcon } from "lucide-react";

interface Props {
  title: string;
  description: string;
  icon: LucideIcon;
}

// Envolvemos el componente con memo()
export const CustomTitleCard = memo(({title, description, icon: Icon}: Props) => {
  return (
    <div className="flex items-center gap-3 md:gap-4 pb-5 md:pb-6">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <Icon className="h-6 w-6 text-primary" />
        </div>
        
        <div className="flex flex-col min-w-0">
            <h2 className="text-lg md:text-xl font-bold text-foreground truncate whitespace-normal break-words">
                {title}
            </h2>
            <p className="text-sm md:text-base text-muted-foreground mt-0.5">
                {description}
            </p>
            </div>
    </div>
  )
});

CustomTitleCard.displayName = "CustomTitleCard";

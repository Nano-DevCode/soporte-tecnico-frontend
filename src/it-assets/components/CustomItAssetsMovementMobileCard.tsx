import { memo } from "react";
import { Link } from "react-router";
import { Eye, ArrowRightLeft, ArrowDownRight, ArrowUpRight, Monitor } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import type { ItAssetsMovement } from "../interfaces/itAssetsMovementResponse";

interface Props {
  movements: ItAssetsMovement[];
}

export const CustomItAssetsMovementMobileCard = memo(({ movements }: Props) => {
  const { t } = useTranslation();

  return (
    <div className="md:hidden space-y-3">
      {movements.map((mov) => {
        const formattedDate = new Date(mov.createdAt).toLocaleDateString('es-MX', {
          year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });
        const isInput = mov.type === "IN" || mov.movementIn !== null;

        return (
          <div
            key={mov.id}
            className="flex items-center gap-3 rounded-xl border border-border bg-card p-3.5 shadow-sm transition-colors hover:bg-muted/50"
          >
            {/* FOTO (Izquierda) */}
            <div className="shrink-0 h-14 w-14 rounded-lg overflow-hidden border border-border bg-muted flex items-center justify-center shadow-sm">
              {mov.itAsset.imageUrl ? (
                <img 
                  src={mov.itAsset.imageUrl} 
                  alt={t("itAssets.components.movementMobileCard.imageAlt")} 
                  className="h-full w-full object-cover" 
                />
              ) : (
                <Monitor className="h-6 w-6 text-muted-foreground/40" />
              )}
            </div>

            {/* CONTENIDO CENTRAL */}
            <div className="min-w-0 flex-1 space-y-1.5">
              <div className="flex items-start justify-between gap-2">
                <Badge 
                  variant="outline"
                  className={cn(
                    "font-semibold text-[10px] px-2 py-0 border-none gap-1", 
                    isInput 
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400" 
                      : "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400"
                  )}
                >
                  {isInput ? <ArrowDownRight className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                  {isInput 
                    ? t("itAssets.components.movementMobileCard.badges.in") 
                    : t("itAssets.components.movementMobileCard.badges.out")}
                </Badge>
                <span className="text-[10px] text-muted-foreground font-medium shrink-0">
                  {formattedDate}
                </span>
              </div>

              {/* Se quitó 'truncate' y se agregó 'whitespace-normal break-words' */}
              <p className="text-sm font-bold text-foreground leading-snug whitespace-normal break-words">
                {mov.itAsset.serialNumber}
              </p>

              {/* Se cambió a 'ID INVENTARIO INTERNO', se quitó 'truncate' y se agregó 'whitespace-normal break-words' */}
              <p className="text-xs text-muted-foreground font-mono whitespace-normal break-words">
                ID INVENTARIO INTERNO: {mov.itAsset.idInventary || t("itAssets.components.movementMobileCard.assetInfo.na")}
              </p>
            </div>

            {/* ACCIÓN DERECHA */}
            <div className="shrink-0 border-l border-border/50 pl-2">
              <Link to={`/it-assets/movements/${mov.id}`}>
                <Button variant="ghost" size="icon" className="h-10 w-10 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950/50 dark:hover:text-blue-400">
                  <Eye className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        );
      })}

      {movements.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card py-16">
          <ArrowRightLeft className="h-10 w-10 text-muted-foreground/40" />
          <p className="mt-3 text-sm font-medium text-muted-foreground">
            {t("itAssets.components.movementMobileCard.emptyState.title")}
          </p>
          <p className="mt-1 text-xs text-muted-foreground/70 text-center px-4">
            {t("itAssets.components.movementMobileCard.emptyState.description")}
          </p>
        </div>
      )}
    </div>
  );
});
import { memo, useState } from "react";
import { Link } from "react-router";
import { Eye, ArrowRightLeft, ArrowDownRight, ArrowUpRight, Monitor } from "lucide-react";
import { TableBody, TableCell, TableHead, TableHeader, TableRow, Table } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import type { ItAssetsMovement } from "../interfaces/itAssetsMovementResponse";

interface Props {
  movements: ItAssetsMovement[];
}

const AssetThumbnail = ({ src, altText }: { src?: string | null, altText: string }) => {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div className="h-10 w-10 mx-auto rounded-md bg-muted flex items-center justify-center border border-border shadow-sm">
        <Monitor className="h-5 w-5 text-muted-foreground/50" />
      </div>
    );
  }

  return (
    <div className="h-10 w-10 mx-auto rounded-md overflow-hidden border border-border shadow-sm bg-muted flex items-center justify-center">
      <img 
        src={src} 
        alt={altText} 
        onError={() => setHasError(true)} 
        className="h-full w-full object-cover transition-transform hover:scale-110" 
      />
    </div>
  );
};

export const CustomItAssetsMovementDesktopTable = memo(({ movements }: Props) => {
  const { t } = useTranslation();

  return (
    <div className="hidden md:block rounded-xl border border-border shadow-sm overflow-hidden bg-card">
      <Table className="w-full">
        <TableHeader>
          <TableRow>
            <TableHead>{t("itAssets.components.movementDesktopTable.headers.date")}</TableHead>
            <TableHead className="text-center">{t("itAssets.components.movementDesktopTable.headers.type")}</TableHead>
            <TableHead className="text-center">{t("itAssets.components.movementDesktopTable.headers.photo")}</TableHead>
            <TableHead>{t("itAssets.components.movementDesktopTable.headers.asset")}</TableHead>
            <TableHead className="text-center">{t("itAssets.components.movementDesktopTable.headers.details")}</TableHead>
          </TableRow>
        </TableHeader>
        
        <TableBody>
          {movements.map((mov) => {
            const formattedDate = new Date(mov.createdAt).toLocaleDateString('es-MX', {
              year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
            });

            const isInput = mov.type === "IN" || mov.movementIn !== null;
            
            return (
              <TableRow key={mov.id} className="group transition-colors">
                
                {/* FECHA */}
                <TableCell className="align-middle py-4 text-sm font-medium text-muted-foreground truncate max-w-none">
                  {formattedDate}
                </TableCell>

                {/* TIPO */}
                <TableCell className="align-middle text-center py-4 uppercase max-w-none">
                  <Badge 
                    variant="outline"
                    className={cn(
                      "font-semibold px-2.5 py-0.5 rounded-full shadow-sm gap-1",
                      isInput 
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400" 
                        : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400"
                    )}
                  >
                    {isInput ? <ArrowDownRight className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                    {isInput 
                      ? t("itAssets.components.movementDesktopTable.badges.in") 
                      : t("itAssets.components.movementDesktopTable.badges.out")}
                  </Badge>
                </TableCell>
                
                {/* FOTO */}
                <TableCell className="align-middle py-4 text-center max-w-none">
                  <AssetThumbnail 
                    src={mov.itAsset.imageUrl} 
                    altText={t("itAssets.components.movementDesktopTable.imageAlt")} 
                  />
                </TableCell>

                {/* ACTIVO / SERIAL */}
                <TableCell className="align-middle py-4 max-w-none">
                  <div className="flex flex-col min-w-0">
                    {/* Se quitó truncate y se agregó whitespace-normal break-words */}
                    <span className="text-sm font-bold text-foreground whitespace-normal break-words block leading-snug">
                      {mov.itAsset.serialNumber}
                    </span>
                    {/* Se cambió el label a "ID INVENTARIO INTERNO" y se agregó whitespace-normal break-words */}
                    <span className="text-xs text-muted-foreground font-mono whitespace-normal break-words block mt-0.5">
                      ID INVENTARIO INTERNO: {mov.itAsset.idInventary || t("itAssets.components.movementDesktopTable.assetInfo.na")}
                    </span>
                  </div>
                </TableCell>

                {/* ACCIÓN (DETALLES) */}
                <TableCell className="text-center align-middle py-4 max-w-none">
                  <Link to={`/it-assets/movements/${mov.id}`}>
                    <Button variant="ghost" size="icon" className="hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950/50 dark:hover:text-blue-400 transition-colors">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                </TableCell>

              </TableRow>
            );
          })}

          {/* ESTADO VACÍO */}
          {movements.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-10 text-muted-foreground max-w-none">
                <div className="flex flex-col items-center gap-3">
                  <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center border border-border">
                    <ArrowRightLeft className="h-6 w-6 text-muted-foreground opacity-50" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-base font-semibold text-foreground">
                      {t("itAssets.components.movementDesktopTable.emptyState.title")}
                    </p>
                    <p className="text-sm">
                      {t("itAssets.components.movementDesktopTable.emptyState.description")}
                    </p>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
});
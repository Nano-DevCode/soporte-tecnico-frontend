import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Eye, MoreHorizontal, Pencil, PowerOff, CheckCircle } from "lucide-react";
import { Link } from "react-router";
import { cn } from "@/lib/utils";
import type { ItAsset } from "../interfaces/itAssetsResponse";
import { t } from "i18next";

interface Props {
  asset: ItAsset;
  handleDownClick: (asset: ItAsset) => void;
}

export const CustomItAssetActionsMenu = ({
  asset, handleDownClick
}: Props ) => {
  
  const isActive = asset.status;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          
          <DropdownMenuItem className="gap-2 cursor-pointer" asChild>
            <Link to={`/it-assets/${asset.id}`}>
              <Eye className="h-4 w-4 text-muted-foreground" />
              {t("itAssets.actionsMenu.view", "Ver detalle")}
            </Link>
          </DropdownMenuItem>
          
          <DropdownMenuItem className="gap-2 cursor-pointer" asChild>
            <Link to={`/it-assets/edit/${asset.id}`}>
              <Pencil className="h-4 w-4 text-muted-foreground" />
              {t("itAssets.actionsMenu.edit", "Editar")}
            </Link>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />

          <DropdownMenuItem 
            className={cn(
              "gap-2 cursor-pointer font-medium transition-colors",
              isActive 
                ? "text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/30" 
                : "text-emerald-600 focus:text-emerald-600 focus:bg-emerald-50 dark:focus:bg-emerald-950/30"
            )}
            onClick={() => handleDownClick(asset)}
          >
            {isActive ? (
              <>
                <PowerOff className="h-4 w-4" />
                {t("itAssets.actionsMenu.down", "Dar de baja")}
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4" />
                {t("itAssets.actionsMenu.up", "Reactivar")}
              </>
            )}
          </DropdownMenuItem>
          
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
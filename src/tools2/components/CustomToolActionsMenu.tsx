import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Eye, MoreHorizontal, Pencil, PowerOff, CheckCircle } from "lucide-react";
import { Link } from "react-router";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import type { Tool } from "../interfaces/toolsResponse.interface";

interface Props {
  tool: Tool;
  handleDownClick: (tool: Tool) => void;
  disable?: boolean;
}

export const CustomToolActionsMenu = ({
  tool, handleDownClick, disable = false
}: Props ) => {
  const { t } = useTranslation();
  const isActive = tool.status;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            disabled={disable}
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          
          <DropdownMenuItem className="gap-2 cursor-pointer" asChild>
            <Link to={`/tools/${tool.id}`}>
              <Eye className="h-4 w-4 text-muted-foreground" />
              {t("tools.components.actionsMenu.view")}
            </Link>
          </DropdownMenuItem>
          
          <DropdownMenuItem className="gap-2 cursor-pointer" asChild>
            <Link to={`/tools/edit/${tool.id}`}>
              <Pencil className="h-4 w-4 text-muted-foreground" />
              {t("tools.components.actionsMenu.edit")}
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
            onClick={() => handleDownClick(tool)}
          >
            {isActive ? (
              <>
                <PowerOff className="h-4 w-4" />
                {t("tools.components.actionsMenu.down")}
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4" />
                {t("tools.components.actionsMenu.up")}
              </>
            )}
          </DropdownMenuItem>
          
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
};

export default CustomToolActionsMenu;
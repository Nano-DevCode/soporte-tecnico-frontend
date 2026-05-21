import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Eye, MoreHorizontal, Pencil, PowerOff, CheckCircle } from "lucide-react"; // Íconos actualizados
import { Link } from "react-router";
import { cn } from "@/lib/utils";
import type { Tool } from "../interfaces/toolsResponse";
import { t } from "i18next";

interface Props {
  tool: Tool;
  handleDownClick: (tool: Tool) => void;
}

export const CustomToolActionsMenu = ({
  tool, handleDownClick
}: Props ) => {
  
  const isActive = tool.status;

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
            <Link to={`/tools/${tool.id}`}>
              <Eye className="h-4 w-4 text-muted-foreground" />
              {t("tools.actionsMenu.view")}
            </Link>
          </DropdownMenuItem>
          
          <Link to={`/tools/edit/${tool.id}`}>
            <DropdownMenuItem className="gap-2 cursor-pointer">
              <Pencil className="h-4 w-4 text-muted-foreground" />
              {t("tools.actionsMenu.edit")}
            </DropdownMenuItem>
          </Link>
          
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
                {t("tools.actionsMenu.down")}
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4" />
                {t("tools.actionsMenu.up")}
              </>
            )}
          </DropdownMenuItem>
          
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
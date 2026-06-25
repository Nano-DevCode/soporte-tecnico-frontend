import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { Department } from "../interfaces/department.interface";
import { Button } from "@/components/ui/button";
import { Eye, MoreHorizontal, Pencil, PowerOff, CheckCircle } from "lucide-react"; // Íconos actualizados
import { Link } from "react-router";
import { cn } from "@/lib/utils";
import { t } from "i18next";

interface Props {
  department: Department;
  handleDownClick: (department: Department) => void;
}

export const CustomDepartmentActionsMenu = ({
  department, handleDownClick
}: Props ) => {
  
  const isActive = department.status;

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
            <Link to={`/departments/${department.id}`}>
              <Eye className="h-4 w-4 text-muted-foreground" />
              {t("custom_department_actions_menu_view_details")}
            </Link>
          </DropdownMenuItem>
          
          <Link to={`/departments/edit/${department.id}`}>
            <DropdownMenuItem className="gap-2 cursor-pointer">
              <Pencil className="h-4 w-4 text-muted-foreground" />
              {t("custom_department_actions_menu_edit")}
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
            onClick={() => handleDownClick(department)}
          >
            {isActive ? (
              <>
                <PowerOff className="h-4 w-4" />
                {t("custom_department_actions_menu_down")}
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4" />
                {t("custom_department_actions_menu_up")}
              </>
            )}
          </DropdownMenuItem>
          
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
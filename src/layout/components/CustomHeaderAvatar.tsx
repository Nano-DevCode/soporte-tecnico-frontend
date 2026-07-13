import { useAuthStore } from "@/auth/store/auth.store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuItem, 
  DropdownMenu 
} from "@/components/ui/dropdown-menu";
import { Link, useNavigate } from "react-router"; // <-- Importamos useNavigate
import { useTranslation } from 'react-i18next';
import { CustomModeToggle } from "@/components/custom/CustomModeToggle";
import { useQueryClient } from "@tanstack/react-query"; // <-- Importamos useQueryClient

export const CustomHeaderAvatar = () => {
  const { user, logout } = useAuthStore();
  const { t } = useTranslation();
  
  // Inicializamos los hooks
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Función manejadora del logout
  const handleLogout = async () => {
     queryClient.clear();
    await logout();
    navigate("/auth/login");
  };

  return (
    <div className="flex items-center gap-2 sm:gap-4">
      <CustomModeToggle/>
      <DropdownMenu>

        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0">
            <Avatar className="h-9 w-9">
              <AvatarImage src="/placeholder-user.jpg" alt="Admin" />
              <AvatarFallback className="bg-primary text-xs text-primary-foreground">
                { (user?.staff?.name || "US").substring(0,2) }
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-56" align="end" forceMount>

          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user?.staff?.name || "Cargando..."}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user?.email || "Cargando..."}
              </p>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          <Link to="/account/profile">
            <DropdownMenuItem className="cursor-pointer">
              {t("profile")}
            </DropdownMenuItem>
          </Link>
          <Link to="/account/configuration">
            <DropdownMenuItem className="cursor-pointer">
              {t("settings")}
            </DropdownMenuItem>
          </Link>
          
          <DropdownMenuSeparator />
          
          {/* Usamos el manejador en lugar del Link para tener control asíncrono */}
          <DropdownMenuItem onClick={handleLogout} className="text-destructive cursor-pointer">
            {t("logout")}
          </DropdownMenuItem>
          
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
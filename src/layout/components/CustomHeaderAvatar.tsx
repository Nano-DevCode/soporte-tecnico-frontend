import { useAuthStore } from "@/auth/store/auth.store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem, DropdownMenu } from "@/components/ui/dropdown-menu"
import { Link } from "react-router";
import { useTranslation } from 'react-i18next';
import { CustomModeToggle } from "@/components/custom/CustomModeToggle";


export const CustomHeaderAvatar = () => {
  const { user, logout } = useAuthStore();
  const { t } = useTranslation();
  return (
    <div className="flex items-center gap-2 sm:gap-4">
      <CustomModeToggle/>
      <DropdownMenu>

        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0">
            <Avatar className="h-9 w-9">
              <AvatarImage src="/placeholder-user.jpg" alt="Admin" />
              <AvatarFallback className="bg-primary text-xs text-primary-foreground">
                { user?.staff.name.substring(0,2) }
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-56" align="end" forceMount>

          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user?.staff.name}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user?.email}
              </p>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          <Link to="/account/profile">
            <DropdownMenuItem>
              {t("profile")}
            </DropdownMenuItem>
          </Link>
          <Link to="/account/configuration">
            <DropdownMenuItem>
              {t("settings")}
            </DropdownMenuItem>
          </Link>
          <DropdownMenuSeparator />
          <Link to="/auth/login">
            <DropdownMenuItem onClick={logout} className="text-destructive">
              {t("logout")}
            </DropdownMenuItem>
          </Link>
          
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

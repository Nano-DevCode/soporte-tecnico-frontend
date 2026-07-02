import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Eye, MoreHorizontal, Pencil, UserCheck, UserMinus } from 'lucide-react'
import { Link } from 'react-router'
import type { User } from '../interfaces/users.response';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

interface Props {
  user: User;
  handleStatusClick: (user: User) => void;
  disabled?: boolean;
}

export const CustomUserActionsMenu = ({ user, handleStatusClick, disabled }: Props) => {
  const { t } = useTranslation();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          disabled={disabled}
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem className="gap-2" asChild>
          <Link to={`/users/${user.id}`}>
            <Eye className="h-4 w-4" />
            {t("users.components.customUserActionsMenu.viewDetails")}
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuItem className="gap-2" asChild>
          <Link to={`/users/edit/${user.id}`}>
            <Pencil className="h-4 w-4" />
            {t("users.components.customUserActionsMenu.edit")}
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        {/* Ítem dinámico: Dar de Baja / Dar de Alta */}
        <DropdownMenuItem 
          className={cn(
            "gap-2",
            user.status 
              ? "text-destructive focus:text-destructive" 
              : "text-blue-600 focus:text-blue-600 dark:text-blue-400 dark:focus:text-blue-400"
          )} 
          onClick={() => handleStatusClick(user)}
        >
          {user.status ? (
            <>
              <UserMinus className="h-4 w-4" />
              {t("users.components.customUserActionsMenu.down")}
            </>
          ) : (
            <>
              <UserCheck className="h-4 w-4" />
              {t("users.components.customUserActionsMenu.up")}
            </>
          )}
        </DropdownMenuItem>

      </DropdownMenuContent>
    </DropdownMenu>
  )
}
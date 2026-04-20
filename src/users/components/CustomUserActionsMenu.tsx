import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Eye, MoreHorizontal, Pencil, UserCheck, UserMinus } from 'lucide-react'
import { Link } from 'react-router'
import type { User } from '../interfaces/users.response';
import { cn } from '@/lib/utils';

interface Props {
  user: User;
  handleStatusClick: (user: User) => void;
}

export const CustomUserActionsMenu = ({ user, handleStatusClick }: Props) => {
  return (
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
      <DropdownMenuContent align="end">
        <DropdownMenuItem className="gap-2" asChild>
          <Link to={`/user/details/${user.id}`}>
            <Eye className="h-4 w-4" />
            Ver Detalles
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuItem className="gap-2" asChild>
          <Link to={`/user/edit/${user.id}`}>
            <Pencil className="h-4 w-4" />
            Editar
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
              Dar de Baja
            </>
          ) : (
            <>
              <UserCheck className="h-4 w-4" />
              Dar de Alta
            </>
          )}
        </DropdownMenuItem>

      </DropdownMenuContent>
    </DropdownMenu>
  )
}
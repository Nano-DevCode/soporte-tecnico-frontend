import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Eye, MoreHorizontal, Pencil, Trash2, UserMinus } from 'lucide-react'
import { Link } from 'react-router'
import type { User } from '../interfaces/users.response';

interface Props {
  user: User;
  handleBajaClick: (user: User) => void;
  handleEliminarClick: (user: User) => void;
}

export const CustomUserActionsMenu = ({ user, handleBajaClick, handleEliminarClick}: Props) => {
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
          <DropdownMenuItem className="gap-2 text-amber-600 focus:text-amber-600" onClick={() => handleBajaClick(user)}>
            <UserMinus className="h-4 w-4" />
              Dar de Baja
          </DropdownMenuItem>
          <DropdownMenuItem className="gap-2 text-destructive focus:text-destructive" onClick={() => handleEliminarClick(user)}>
            <Trash2 className="h-4 w-4" />
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

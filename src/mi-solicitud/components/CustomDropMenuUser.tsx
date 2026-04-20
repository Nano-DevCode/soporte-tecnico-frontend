import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Edit2, Eye, MoreVertical, Power, Trash2 } from "lucide-react"
import { Link } from "react-router"
import type { User } from "./CustomTableSolicitudDepartamento";

interface Props {
  handleBajaClick: (user: User) => void;
  handleEliminarClick: (user: User ) => void;
  user: User;
}

export const CustomDropMenuUser = ({handleBajaClick, handleEliminarClick, user}:Props) => {
  return (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreVertical className="h-4 w-4" />
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem asChild>
            <Link to={`/`} className="cursor-pointer">
                <Eye className="h-4 w-4 mr-2" />
                Ver detalles de usuario
            </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
            <Link to={`/`} className="cursor-pointer">
                <Edit2 className="h-4 w-4 mr-2" />
                Editar usuario
            </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleBajaClick(user)}>
            <Power className="h-4 w-4 mr-2" />
                Baja
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-600" onClick={() => handleEliminarClick(user)}>
            <Trash2 className="h-4 w-4 mr-2" />
                Eliminar
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
  )
}

import { useState } from 'react'
import { Heart } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { CustomDialogConfirm } from '@/components/custom/CustomDialogCorfirm'
import { CustomDropMenuUser } from './CustomDropMenuUser';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';

export interface User {
  id: number;
  correo: string;
  nombre: string;
  primerApellido: string;
  segundoApellido: string;
  rol: string;
  avatar: string;
  estado: 0 | 1;
}
type EstadoUsuario = 0 | 1

const estadoUsuarioConfig: Record<EstadoUsuario, string> = {
  1: "bg-emerald-100 text-emerald-700 border-emerald-200 center-item",
  0: "bg-red-100 text-red-700 border-red-200 center-item",
}

function EstadoUsuarioBadge({ estado }: { estado: EstadoUsuario }) {
  return (
    <Badge
      variant="outline"
      className={cn("font-semibold", estadoUsuarioConfig[estado])}
    >
      {
        estado === 1 ? 'Activo' : 'Inactivo'
      }
    </Badge>
  )
}

interface UserProps {
  users: User[]
}

export const CustomTableSolicitudDepartamento = ({ users }: UserProps) => {
  const [bajaDialogOpen, setBajaDialogOpen] = useState(false)
  const [eliminarDialogOpen, setEliminarDialogOpen] = useState(false)
  const [userSeleccionado, setUserSeleccionado] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleBajaClick = (user: User) => {
    setUserSeleccionado(user)
    setBajaDialogOpen(true)
  }

  const handleEliminarClick = (user: User) => {
    setUserSeleccionado(user)
    setEliminarDialogOpen(true)
  }

  const handleConfirmarBaja = async () => {
    setIsLoading(true)
    try {
      console.log('Confirmar baja del usuario:', userSeleccionado?.id);
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Baja del usuario confirmada exitosamente');
      setBajaDialogOpen(false)
    } catch (error) {
      console.error('Error al dar de baja:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleConfirmarEliminar = async () => {
    setIsLoading(true)
    try {
      console.log('[v0] Deleting equipment:', userSeleccionado?.id)
      await new Promise(resolve => setTimeout(resolve, 1500))
      console.log('[v0] Equipo eliminado exitosamente')
      setEliminarDialogOpen(false)
    } catch (error) {
      console.error('[v0] Error al eliminar:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (users.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-muted-foreground/25 bg-muted/30 p-8 text-center">
        <p className="text-sm text-muted-foreground">No hay equipos que mostrar</p>
      </div>
    )
  }

  return (
    <>
      <CustomDialogConfirm
        open={bajaDialogOpen}
        isLoading={isLoading}
        title='Estas seguro de dar de baja al usuario'
        description='Este cambio pasara al usaurio a un estado que no permitira realizar operaciones'
        icon={Heart}
        onConfirm={handleConfirmarBaja}
        onOpenChange={setBajaDialogOpen}
      />
      <CustomDialogConfirm
        open={eliminarDialogOpen}
        isLoading={isLoading}
        title=''
        description=''
        icon={Heart}
        onConfirm={handleConfirmarEliminar}
        onOpenChange={setEliminarDialogOpen}
      />

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader className="bg-muted/50 hover:bg-muted/50">
            <TableRow>
              <TableHead className="text-xs font-semibold text-foreground sm:text-sm">ID</TableHead>
              <TableHead className="text-xs font-semibold text-foreground sm:text-sm">Correo</TableHead>
              <TableHead className="text-xs font-semibold text-foreground sm:text-sm">Nombre</TableHead>
              <TableHead className="text-xs font-semibold text-foreground sm:text-sm">Rol</TableHead>
              <TableHead className="text-xs font-semibold text-foreground sm:text-sm">Estados</TableHead>
              <TableHead className="text-xs font-semibold text-foreground text-right sm:text-sm">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            { users.map( (user) => (
              <TableRow key={user.id} className="hover:bg-muted/50" >
                <TableCell className="text-xs font-medium text-primary sm:text-sm">
                  {user.id}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{user.correo}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <p className="font-medium">{user.nombre}</p>
                    <p className="text-xs text-muted-foreground">{user.primerApellido} {user.segundoApellido}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <p className="font-medium">{user.rol}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="pt-0.5">
                    <EstadoUsuarioBadge estado={user.estado} />
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  
                  <CustomDropMenuUser 
                    handleBajaClick={handleBajaClick} 
                    handleEliminarClick={handleEliminarClick}
                    user={user}
                  />

                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* npx tsc -v */}
      <div className="md:hidden space-y-3">
        {users.map((user) => (
          <Card key={user.id} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <Badge variant="secondary" className="font-mono text-xs">
                    tempo
                  </Badge>

                  <CustomDropMenuUser 
                    handleBajaClick={handleBajaClick} 
                    handleEliminarClick={handleEliminarClick}
                    user={user}
                  />
                </div>

                {/* Tipo y Detalle */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    Icono
                    <span className="text-sm font-medium">{user.nombre}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {user.nombre} - {user.primerApellido}
                  </p>
                </div>

                { /* Responsable */ }
                <div className="space-y-1 border-t pt-3">
                  <p className="text-xs font-semibold text-muted-foreground uppercase">
                    Responsable
                  </p>
                  <p className="text-sm font-medium">{user.correo}</p>
                  <p className="text-xs text-muted-foreground">{user.nombre}</p>
                </div>

                {/*  Estado */ }
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-block h-2 w-2 rounded-full ${
                      user.estado === 1 ? 'bg-green-500' : 'bg-red-500'
                    }`}
                  />
                  <span className="text-sm">{user.estado}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
    </>
  )
}
